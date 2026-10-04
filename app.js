const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
const KEY="clinicalBrainNCMHCE_v1";
let state=JSON.parse(localStorage.getItem(KEY)||"{}");
state.answers=state.answers||{};
state.activity=state.activity||[];
state.profile=state.profile||"current";
let session={items:[],i:0,score:0,streak:0,answered:false,mode:"smart"};
let caseRun=null;

function save(){localStorage.setItem(KEY,JSON.stringify(state));renderHomeStats();}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1900);}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function route(id){
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===id));
  $$(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.route===id));
  if(id==="review")renderReview();
  if(id==="dashboard")renderDashboard();
  if(id==="home")renderHomeStats();
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-route]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();route(b.dataset.route)}));

function stats(){
  const rows=Object.values(state.answers);
  const total=rows.reduce((n,r)=>n+(r.attempts||0),0);
  const correct=rows.reduce((n,r)=>n+(r.correct||0),0);
  const missed=rows.filter(r=>(r.misses||0)>0).length;
  const mastered=rows.filter(r=>(r.correct||0)>=2 && (r.lastCorrect===true)).length;
  return {total,correct,missed,mastered,pct:total?Math.round(correct/total*100):0};
}
function renderHomeStats(){
  const s=stats();
  $("#homeStats").innerHTML=[
    ["Questions answered",s.total,"hot"],
    ["Accuracy",s.pct+"%","lime"],
    ["Missed concepts",s.missed,"cyan"],
    ["Mastered",s.mastered,"violet"]
  ].map(([l,v,c])=>'<div class="stat '+c+'"><b>'+v+'</b><small>'+l+'</small></div>').join("");
}
function setRule(){ $("#ruleOfDay").textContent=VISUAL_RULES[new Date().getDate()%VISUAL_RULES.length]; }
function setProfile(p){
  state.profile=p; save();
  $("#profileCurrent").classList.toggle("selected",p==="current");
  $("#profile2027").classList.toggle("selected",p==="2027");
  toast(p==="current"?"Studying current exam profile":"Studying July 2027+ profile");
}
$("#profileCurrent").onclick=()=>setProfile("current");
$("#profile2027").onclick=()=>setProfile("2027");
setProfile(state.profile);

DOMAINS.forEach(d=>$("#domainFilter").insertAdjacentHTML("beforeend",'<option value="'+d+'">'+d+'</option>'));

function weightedPool(base){
  const bag=[];
  base.forEach(q=>{
    const r=state.answers[q.id]||{};
    let w=1;
    if((r.misses||0)>0)w+=2;
    if(r.lastCorrect===false)w+=2;
    if(r.confidence==="guess")w+=1;
    for(let i=0;i<w;i++)bag.push(q);
  });
  const picked=[],seen=new Set();
  for(const q of shuffle(bag)){if(!seen.has(q.id)){picked.push(q);seen.add(q.id)}}
  return picked;
}
function modePool(mode){
  let p=QUESTIONS.filter(q=>q.profiles.includes(state.profile)||q.profiles.includes("both"));
  if(mode==="ethics")p=p.filter(q=>q.domain==="Professional Practice & Ethics");
  if(mode==="diagnosis")p=p.filter(q=>["Intake, Assessment & Diagnosis","Areas of Clinical Focus"].includes(q.domain));
  if(mode==="treatment")p=p.filter(q=>["Treatment Planning","Counseling Skills & Interventions"].includes(q.domain));
  return p;
}
function startMode(mode="smart",len){
  session={items:[],i:0,score:0,streak:0,answered:false,mode};
  let pool=modePool(mode);
  let count=len||((mode==="lightning")?15:10);
  if(mode==="smart")session.items=weightedPool(pool).slice(0,count);
  else session.items=shuffle(pool).slice(0,Math.min(count,pool.length));
  route("quiz"); showQuestion();
}
$$("[data-mode]").forEach(b=>b.addEventListener("click",()=>startMode(b.dataset.mode)));
$("#startSmart").onclick=()=>startMode("smart",10);
$("#customStart").onclick=()=>{
  let p=QUESTIONS.filter(q=>q.profiles.includes(state.profile)||q.profiles.includes("both"));
  const d=$("#domainFilter").value;if(d!=="all")p=p.filter(q=>q.domain===d);
  const count=Number($("#lengthFilter").value);
  session={items:shuffle(p).slice(0,Math.min(count,p.length)),i:0,score:0,streak:0,answered:false,mode:"custom"};
  route("quiz");showQuestion();
};
$("#practiceBack").onclick=()=>route("home");

function showQuestion(){
  const q=session.items[session.i];
  if(!q)return finishQuiz();
  session.answered=false;
  $("#quizMeta").innerHTML="<span>"+(session.i+1)+" of "+session.items.length+"</span><span>"+session.mode.toUpperCase()+"</span>";
  $("#quizProgress").style.width=((session.i)/session.items.length*100)+"%";
  $("#streakBox").textContent="🔥 "+session.streak;
  $("#questionTags").innerHTML='<span class="tag">'+q.domain+'</span><span class="tag priority">'+q.topic+'</span><span class="tag">Level '+q.difficulty+'</span>';
  $("#questionText").textContent=q.q;
  $("#questionStem").textContent=q.stem||"";
  $("#feedback").className="feedback"; $("#feedback").innerHTML="";
  $("#confidenceBox").classList.remove("show");
  $$("#confidenceBox button").forEach(b=>b.classList.remove("selected"));
  $("#nextQuestion").classList.remove("show");
  $("#answerChoices").innerHTML="";
  q.choices.forEach((c,i)=>{
    const b=document.createElement("button");b.className="answer-btn";b.textContent=String.fromCharCode(65+i)+". "+c;
    b.onclick=()=>answerQuestion(i,b);$("#answerChoices").appendChild(b);
  });
}
function answerQuestion(choice,btn){
  if(session.answered)return;session.answered=true;
  const q=session.items[session.i],ok=choice===q.answer;
  if(ok){session.score++;session.streak++;} else session.streak=0;
  $$(".answer-btn").forEach((b,i)=>{
    b.disabled=true;
    if(i===q.answer)b.classList.add("correct");
    else if(i===choice)b.classList.add("wrong");
    else b.classList.add("dim");
  });
  const f=$("#feedback");f.className="feedback show "+(ok?"good":"bad");
  f.innerHTML='<div class="big">'+(ok?"✓ YES. Clinical brain online.":"✗ Not this time — this is useful data.")+'</div><div>'+q.why+'</div><div class="rule">🧠 '+q.rule+'</div>';
  $("#confidenceBox").classList.add("show");$("#nextQuestion").classList.add("show");
  const r=state.answers[q.id]||{attempts:0,correct:0,misses:0};
  r.attempts++;if(ok)r.correct++;else r.misses++;r.lastCorrect=ok;r.lastSeen=Date.now();state.answers[q.id]=r;
  state.activity.unshift({t:Date.now(),id:q.id,topic:q.topic,ok,mode:session.mode});state.activity=state.activity.slice(0,40);save();
}
$$("#confidenceBox button").forEach(b=>b.onclick=()=>{
  const q=session.items[session.i]; const r=state.answers[q.id]||{};r.confidence=b.dataset.confidence;state.answers[q.id]=r;save();
  $$("#confidenceBox button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");
});
$("#nextQuestion").onclick=()=>{session.i++; if(session.i<session.items.length)showQuestion();else finishQuiz();};

function finishQuiz(){
  const n=session.items.length,pct=n?Math.round(session.score/n*100):0;
  $("#quizProgress").style.width="100%";
  $("#questionTags").innerHTML='<span class="tag">ROUND COMPLETE</span>';
  $("#questionText").textContent=pct>=80?"🔥 Your clinical brain showed up.":pct>=60?"🧠 Solid data. Now target the weak spots.":"💥 Good. We found what to study.";
  $("#questionStem").innerHTML="Score: <b>"+session.score+"/"+n+" ("+pct+"%)</b>. The point is not perfection—the app will weight missed concepts more heavily in Smart 10.";
  $("#answerChoices").innerHTML='<button class="cta pink-bg" onclick="startMode(\'smart\',10)">⚡ Smart 10 again</button> <button class="cta green-bg" onclick="route(\'review\')">Review misses</button> <button class="cta blue-bg" onclick="route(\'dashboard\')">See progress</button>';
  $("#feedback").className="feedback";$("#confidenceBox").classList.remove("show");$("#nextQuestion").classList.remove("show");
}
function missedQuestions(){
  return QUESTIONS.filter(q=>(state.answers[q.id]?.misses||0)>0);
}
function renderReview(filter="all"){
  let list=missedQuestions();
  if(filter==="repeat")list=list.filter(q=>(state.answers[q.id]?.misses||0)>=2);
  if(filter==="low")list=list.filter(q=>["guess","maybe"].includes(state.answers[q.id]?.confidence));
  $("#missedList").innerHTML=list.length?list.sort((a,b)=>(state.answers[b.id].misses||0)-(state.answers[a.id].misses||0)).map(q=>{
    const r=state.answers[q.id];
    return '<div class="review-item"><div class="topline"><div><span class="tag">'+q.domain+'</span> <b>'+q.topic+'</b></div><span class="miss-count">× '+r.misses+' miss'+(r.misses===1?"":"es")+'</span></div><p>'+q.q+'</p><div class="rule">🧠 '+q.rule+'</div><div class="muted">Last answer: '+(r.lastCorrect?"correct":"missed")+' • Confidence: '+(r.confidence||"not rated")+'</div></div>';
  }).join(""):'<div class="empty">Nothing here yet. Either you are brand new or suspiciously powerful. Go practice 😎</div>';
}
$$("[data-review]").forEach(b=>b.onclick=()=>{$$("[data-review]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");renderReview(b.dataset.review)});
$("#reviewDrill").onclick=()=>{
  const list=missedQuestions();if(!list.length)return toast("No missed questions yet.");
  session={items:weightedPool(list).slice(0,Math.min(10,list.length)),i:0,score:0,streak:0,answered:false,mode:"missed"};
  route("quiz");showQuestion();
};

function domainStat(domain){
  const qs=QUESTIONS.filter(q=>q.domain===domain);
  let att=0,cor=0;qs.forEach(q=>{const r=state.answers[q.id]||{};att+=r.attempts||0;cor+=r.correct||0});
  return {pct:att?Math.round(cor/att*100):0,att};
}
function renderDashboard(){
  const s=stats();
  $("#dashStats").innerHTML=[["Attempts",s.total,"hot"],["Accuracy",s.pct+"%","lime"],["Missed concepts",s.missed,"cyan"],["Mastered",s.mastered,"violet"]].map(([l,v,c])=>'<div class="stat '+c+'"><b>'+v+'</b><small>'+l+'</small></div>').join("");
  $("#domainBars").innerHTML=DOMAINS.map(d=>{const x=domainStat(d);return '<div class="bar-row"><div class="bar-label"><span>'+d+'</span><b>'+(x.att?x.pct+"%":"—")+'</b></div><div class="bar-track"><div class="bar-fill" style="width:'+(x.att?x.pct:0)+'%"></div></div></div>'}).join("");
  const patterns=[
    ["Priority errors","Questions tagged FIRST/NEXT/BEST often punish jumping ahead. Ask: what stage am I in?"],
    ["Diagnosis errors","Use timeline, duration, recurrence, impairment, and rule-outs before naming a disorder."],
    ["Treatment errors","Match intervention to mechanism + client + stage of care."],
    ["Ethics errors","Clarify consent, authority, confidentiality limits, competence, and consultation before assuming."]
  ];
  $("#patternCards").innerHTML=patterns.map(p=>'<div class="pattern"><b>'+p[0]+'</b><div class="muted">'+p[1]+'</div></div>').join("");
  $("#recentActivity").innerHTML=state.activity.length?state.activity.slice(0,12).map(a=>'<div class="recent-row"><span>'+(a.ok?"✅":"❌")+' '+a.topic+'</span><span class="muted">'+new Date(a.t).toLocaleDateString()+'</span></div>').join(""):'<div class="empty">Practice something and your activity will land here.</div>';
}
$("#resetProgress").onclick=()=>{if(confirm("Reset all locally saved NCMHCE progress on this device?")){state={answers:{},activity:[],profile:state.profile};save();renderDashboard();toast("Progress reset.");}};

function renderCases(){
  $("#casePicker").innerHTML=CASES.map(c=>'<button class="case-card" data-case="'+c.id+'"><div class="icon">'+c.icon+'</div><h3>'+c.title+'</h3><p>'+c.focus+'</p></button>').join("");
  $$("[data-case]").forEach(b=>b.onclick=()=>startCase(b.dataset.case));
}
function startCase(id){
  const c=CASES.find(x=>x.id===id);caseRun={case:c,step:0,score:0,answered:false};
  $("#casePicker").style.display="none";$("#caseStage").classList.remove("hidden");renderCaseStep();
}
function renderCaseStep(){
  const c=caseRun.case,s=c.steps[caseRun.step];
  $("#caseStage").innerHTML='<div class="case-head"><div><span class="tag">'+s.section+'</span><h2>'+c.icon+' '+c.title+'</h2></div><button class="ghost" id="leaveCase">← Cases</button></div><div class="case-section"><b>CASE INFO</b><br>'+c.intake+(s.add?'<br><br><b>NEW INFORMATION</b><br>'+s.add:'')+'</div><div class="case-question"><h3>'+s.q+'</h3><div class="answers" id="caseAnswers"></div><div class="feedback" id="caseFeedback"></div><div class="question-actions"><button class="cta green-bg" id="caseNext">Next scene →</button></div></div>';
  $("#leaveCase").onclick=()=>{$("#casePicker").style.display="grid";$("#caseStage").classList.add("hidden");};
  s.choices.forEach((x,i)=>{const b=document.createElement("button");b.className="answer-btn";b.textContent=String.fromCharCode(65+i)+". "+x;b.onclick=()=>answerCase(i,b);$("#caseAnswers").appendChild(b)});
}
function answerCase(i,btn){
  if(caseRun.answered)return;caseRun.answered=true;const s=caseRun.case.steps[caseRun.step],ok=i===s.answer;if(ok)caseRun.score++;
  $$("#caseAnswers .answer-btn").forEach((b,j)=>{b.disabled=true;if(j===s.answer)b.classList.add("correct");else if(j===i)b.classList.add("wrong");else b.classList.add("dim")});
  const f=$("#caseFeedback");f.className="feedback show "+(ok?"good":"bad");f.innerHTML='<div class="big">'+(ok?"✓ Correct":"✗ Rework the clinical sequence")+'</div><div>'+s.why+'</div><div class="rule">🧠 '+s.rule+'</div>';
  $("#caseNext").classList.add("show");$("#caseNext").onclick=()=>{caseRun.step++;caseRun.answered=false;if(caseRun.step<caseRun.case.steps.length)renderCaseStep();else finishCase()};
}
function finishCase(){
  const c=caseRun.case;$("#caseStage").innerHTML='<div class="case-head"><div><span class="tag">CASE COMPLETE</span><h2>'+c.icon+' '+c.title+'</h2></div></div><div class="memory-strip"><div class="memory-title">CASE SCORE</div><div class="memory-rule">'+caseRun.score+'/'+c.steps.length+'</div></div><p class="muted">Try it again later. Case-based repetition is about sequencing—not memorizing a letter choice.</p><div class="hero-actions"><button class="cta pink-bg" id="caseAgain">↻ Replay</button><button class="cta green-bg" id="allCases">All cases</button></div>';
  $("#caseAgain").onclick=()=>startCase(c.id);$("#allCases").onclick=()=>{$("#casePicker").style.display="grid";$("#caseStage").classList.add("hidden")};
}
renderCases();renderHomeStats();setRule();
