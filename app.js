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

let caseFilter="all";
function caseMatches(c,filter){
  if(filter==="all") return true;
  const s=(c.title+" "+c.focus).toLowerCase();
  const maps={
    anxiety:["anxiety","panic","trauma","worry","health anxiety"],
    mood:["depression","mood","self-harm","safety","postpartum","grief"],
    diagnosis:["psychosis","ocd","panic","adhd","differential","eating","health anxiety"],
    ethics:["ethics","confidentiality","boundaries","minor","partner conflict"],
    child:["child","school","family","ari"],
    substance:["substance","cannabis","nia"],
    group:["group","lucas"]
  };
  return (maps[filter]||[]).some(k=>s.includes(k));
}
function renderCases(){
  const list=FULL_CASES.filter(c=>caseMatches(c,caseFilter));
  $("#casePicker").innerHTML=list.map(c=>{
    const total=c.parts.reduce((n,p)=>n+p.questions.length,0);
    return '<button class="case-card" data-case="'+c.id+'"><div class="icon">'+c.icon+'</div><h3>'+c.title+'</h3><p>'+c.focus+'</p><div class="case-count">'+total+' questions · 3 sections</div></button>';
  }).join("");
  $("[data-case]").forEach(b=>b.onclick=()=>startCase(b.dataset.case));
}

function startCase(id){
  const c=FULL_CASES.find(x=>x.id===id);
  caseRun={case:c,part:0,score:0,answers:{},submitted:false};
  $("#casePicker").style.display="none";
  $("#caseStage").classList.remove("hidden");
  renderCasePart();
}

function clientSnapshot(c){
  const m=c.client;
  return '<div class="client-snapshot">'+
    '<div class="snapshot-title">CLIENT SNAPSHOT</div>'+
    '<div class="snapshot-grid">'+
      '<div><span>Age</span><b>'+m.age+'</b></div>'+
      '<div><span>Sex</span><b>'+m.sex+'</b></div>'+
      '<div><span>Gender</span><b>'+m.gender+'</b></div>'+
      '<div><span>Pronouns</span><b>'+m.pronouns+'</b></div>'+
      '<div><span>Orientation</span><b>'+m.orientation+'</b></div>'+
      '<div><span>Race/Ethnicity</span><b>'+m.race+'</b></div>'+
      '<div><span>Relationship</span><b>'+m.relationship+'</b></div>'+
      '<div><span>Setting</span><b>'+m.setting+'</b></div>'+
      '<div><span>Payment</span><b>'+m.payment+'</b></div>'+
      '<div><span>Counseling</span><b>'+m.type+'</b></div>'+
      '<div class="wide"><span>Provisional diagnosis</span><b>'+m.provisional+'</b></div>'+
    '</div></div>';
}

function partTabs(c){
  return '<div class="case-part-tabs">'+c.parts.map((p,i)=>
    '<div class="case-part-tab '+(i===caseRun.part?'active':i<caseRun.part?'done':'')+'">'+
      '<span>'+(i+1)+'</span><div><b>'+p.label+'</b><small>'+p.section+'</small></div>'+
    '</div>').join("")+'</div>';
}

function renderCasePart(){
  const c=caseRun.case,p=c.parts[caseRun.part];
  caseRun.answers={};caseRun.submitted=false;
  $("#caseStage").innerHTML=
    '<div class="case-head"><div><span class="tag priority">FULL CASE SIMULATION</span><h2>'+c.icon+' '+c.title+'</h2><p class="muted">'+c.focus+'</p></div><button class="ghost" id="leaveCase">← Cases</button></div>'+
    partTabs(c)+clientSnapshot(c)+
    '<div class="case-narrative"><div class="narrative-label">'+p.label+' · '+p.section+'</div><p>'+p.narrative+'</p></div>'+
    '<div class="case-questions-head"><div><span class="eyebrow">QUESTIONS FOR THIS SECTION</span><h3>Answer all '+p.questions.length+' before submitting.</h3></div><div class="case-running-score">Case score: '+caseRun.score+'</div></div>'+
    '<div id="partQuestions" class="part-questions">'+
      p.questions.map((q,qi)=>renderPartQuestion(q,qi)).join("")+
    '</div>'+
    '<div class="case-submit-row"><button class="cta pink-bg" id="submitPart">Submit '+p.label+'</button></div>'+
    '<div id="partSummary"></div>';

  $("#leaveCase").onclick=()=>{$("#casePicker").style.display="grid";$("#caseStage").classList.add("hidden");};
  $$(".case-option").forEach(b=>b.onclick=()=>selectCaseAnswer(+b.dataset.q,+b.dataset.a,b));
  $("#submitPart").onclick=submitCasePart;
}

function renderPartQuestion(q,qi){
  return '<article class="lined-question" id="cq'+qi+'">'+
    '<div class="lined-q-top"><span class="q-number">'+(qi+1)+'</span><div><span class="tag">'+q.domain+'</span><div class="subdomain">'+q.sub+'</div></div></div>'+
    '<h4>'+q.q+'</h4>'+
    '<div class="lined-options">'+q.choices.map((x,i)=>
      '<button class="case-option" data-q="'+qi+'" data-a="'+i+'"><span class="letter">'+String.fromCharCode(65+i)+'</span><span>'+x+'</span></button>'
    ).join("")+'</div>'+
    '<div class="case-q-feedback" id="cf'+qi+'"></div>'+
  '</article>';
}

function selectCaseAnswer(qi,ai,btn){
  if(caseRun.submitted)return;
  caseRun.answers[qi]=ai;
  $$('#cq'+qi+' .case-option').forEach(x=>x.classList.remove("selected"));
  btn.classList.add("selected");
}

function submitCasePart(){
  if(caseRun.submitted)return;
  const p=caseRun.case.parts[caseRun.part];
  if(Object.keys(caseRun.answers).length<p.questions.length){
    toast("Answer every question in this section first.");
    return;
  }
  caseRun.submitted=true;
  let partScore=0;
  p.questions.forEach((q,qi)=>{
    const chosen=caseRun.answers[qi],ok=chosen===q.answer;
    if(ok){partScore++;caseRun.score++;}
    $$('#cq'+qi+' .case-option').forEach((b,i)=>{
      b.disabled=true;
      b.classList.remove("selected");
      if(i===q.answer)b.classList.add("correct");
      else if(i===chosen)b.classList.add("wrong");
      else b.classList.add("dim");
    });
    $("#cf"+qi).innerHTML='<div class="case-feedback '+(ok?'good':'bad')+'"><b>'+(ok?'✓ Correct':'✗ Review')+'</b><div>'+q.why+'</div><div class="mini-rule">🧠 '+q.rule+'</div></div>';
  });
  $("#submitPart").style.display="none";
  const isLast=caseRun.part===caseRun.case.parts.length-1;
  $("#partSummary").innerHTML='<div class="part-summary"><div><span class="eyebrow">SECTION RESULT</span><h3>'+partScore+'/'+p.questions.length+' correct</h3><p>'+(isLast?'You finished the full case.':'New information comes next. Do not carry assumptions forward unless the new narrative supports them.')+'</p></div><button class="cta green-bg" id="advancePart">'+(isLast?'Finish case →':'Unlock next section →')+'</button></div>';
  $("#advancePart").onclick=()=>{
    if(isLast) finishCase();
    else {caseRun.part++;renderCasePart();window.scrollTo({top:0,behavior:"smooth"});}
  };
}

function finishCase(){
  const c=caseRun.case,total=c.parts.reduce((n,p)=>n+p.questions.length,0);
  const pct=Math.round(caseRun.score/total*100);
  $("#caseStage").innerHTML=
    '<div class="case-complete">'+
      '<div class="case-complete-brain">🧠⚡</div>'+
      '<span class="tag priority">CASE COMPLETE</span>'+
      '<h2>'+c.title+'</h2>'+
      '<div class="case-score-big">'+caseRun.score+' / '+total+'</div>'+
      '<p>'+pct+'% on this original case simulation. More important: did your reasoning change when the narrative changed?</p>'+
      '<div class="memory-strip"><div class="memory-title">NCMHCE CASE RULE</div><div class="memory-rule">Read only what you know NOW. Intake → questions → new session data → new questions.</div></div>'+
      '<div class="hero-actions"><button class="cta pink-bg" id="caseAgain">↻ Replay case</button><button class="cta green-bg" id="allCases">Choose another</button></div>'+
    '</div>';
  $("#caseAgain").onclick=()=>startCase(c.id);
  $("#allCases").onclick=()=>{$("#casePicker").style.display="grid";$("#caseStage").classList.add("hidden")};
}
$("[data-case-filter]").forEach(b=>b.onclick=()=>{
  caseFilter=b.dataset.caseFilter;
  $("[data-case-filter]").forEach(x=>x.classList.toggle("selected",x===b));
  renderCases();
});
$("#randomCase").onclick=()=>startCase(FULL_CASES[Math.floor(Math.random()*FULL_CASES.length)].id);
renderCases();renderHomeStats();setRule();
