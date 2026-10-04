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


let caseMode="study";
function startCase(id){
  const cc=FULL_CASES.find(x=>x.id===id);
  caseRun={case:cc,part:0,q:0,score:0,answers:{},revealed:{},referenceOpen:true};
  $("#casePicker").style.display="none";
  $("#caseStage").classList.remove("hidden");
  renderCaseQuestion();
}

function clientSnapshotCompact(cc){
  const m=cc.client;
  return '<div class="exam-client-grid">'+
    '<div><b>Age:</b> '+m.age+'</div><div><b>Sex:</b> '+m.sex+'</div>'+
    '<div><b>Gender:</b> '+m.gender+'</div><div><b>Sexuality:</b> '+m.orientation+'</div>'+
    '<div><b>Ethnicity:</b> '+m.race+'</div><div><b>Relationship Status:</b> '+m.relationship+'</div>'+
    '<div><b>Counseling Setting:</b> '+m.setting+'</div><div><b>Type of Counseling:</b> '+m.type+'</div>'+
    '<div class="wide"><b>Diagnosis:</b> '+m.provisional+'</div></div>';
}

function currentGlobalNumber(){
  let n=0;
  for(let i=0;i<caseRun.part;i++) n+=caseRun.case.parts[i].questions.length;
  return n+caseRun.q+1;
}
function totalCaseQuestions(){
  return caseRun.case.parts.reduce((n,p)=>n+p.questions.length,0);
}
function caseNavigator(){
  let n=0, html='<div class="case-nav-grid">';
  caseRun.case.parts.forEach((p,pi)=>p.questions.forEach((q,qi)=>{
    n++;
    const key=pi+"-"+qi, answered=caseRun.answers[key]!==undefined;
    const current=pi===caseRun.part&&qi===caseRun.q;
    html+='<button class="case-nav-num '+(answered?'answered ':'')+(current?'current':'')+'" data-jump-part="'+pi+'" data-jump-q="'+qi+'">'+n+'</button>';
  }));
  return html+'</div>';
}
function caseReference(){
  const cc=caseRun.case,p=cc.parts[caseRun.part];
  return '<div class="question-reference '+(caseRun.referenceOpen?'open':'closed')+'">'+
    '<button class="reference-toggle" id="referenceToggle"><span>Question Reference</span><span>'+(caseRun.referenceOpen?'⌃':'⌄')+'</span></button>'+
    '<div class="reference-body">'+
      (caseRun.part===0?clientSnapshotCompact(cc):'')+
      '<div class="exam-part-label">'+p.label+'</div>'+
      '<div class="exam-session-label">'+p.section+'</div>'+
      '<div class="exam-narrative">'+p.narrative+'</div>'+
    '</div></div>';
}
function renderCaseQuestion(){
  const cc=caseRun.case,p=cc.parts[caseRun.part],q=p.questions[caseRun.q];
  const key=caseRun.part+"-"+caseRun.q;
  const chosen=caseRun.answers[key];
  const global=currentGlobalNumber(),total=totalCaseQuestions();
  $("#caseStage").innerHTML=
    '<div class="case-sim-top"><div><span class="tag priority">'+(caseMode==="study"?'STUDY MODE':'EXAM-LIKE MODE')+'</span><h2>'+cc.icon+' '+cc.title+'</h2></div><button class="ghost" id="leaveCase">← Cases</button></div>'+
    '<div class="exam-shell">'+
      '<aside class="exam-sidebar">'+
        '<div class="exam-progress-label">'+global+' / '+total+'</div>'+
        '<div class="progress"><div style="width:'+Math.round((global-1)/total*100)+'%"></div></div>'+
        '<div class="nav-legend"><span>■ Answered</span><span>□ Unanswered</span></div>'+
        caseNavigator()+
      '</aside>'+
      '<section class="exam-main">'+
        caseReference()+
        '<article class="single-case-question">'+
          '<div class="case-question-number">'+global+'.</div>'+
          '<div class="case-question-body">'+
            '<div class="case-domain-line"><span class="tag">'+q.domain+'</span><span class="subdomain">'+q.sub+'</span></div>'+
            '<h3>'+q.q+'</h3>'+
            (caseMode==="study"?'<button class="hint-toggle" id="hintToggle">💡 Show hint</button><div class="case-hint" id="caseHint">Think: '+q.rule+'</div>':'')+
            '<div class="single-options">'+q.choices.map((x,i)=>'<button class="case-radio '+(chosen===i?'selected':'')+'" data-choice="'+i+'"><span class="radio-dot"></span><span>'+x+'</span></button>').join("")+'</div>'+
            '<div id="singleFeedback"></div>'+
          '</div>'+
        '</article>'+
        '<div class="exam-nav-buttons"><button class="exam-prev" id="casePrev" '+(global===1?'disabled':'')+'>Previous</button><button class="exam-next" id="caseNext">'+(global===total?'Finish':'Next')+'</button></div>'+
      '</section>'+
    '</div>';

  $("#leaveCase").onclick=()=>{$("#casePicker").style.display="grid";$("#caseStage").classList.add("hidden");};
  $("#referenceToggle").onclick=()=>{caseRun.referenceOpen=!caseRun.referenceOpen;renderCaseQuestion();};
  if($("#hintToggle")) $("#hintToggle").onclick=()=>$("#caseHint").classList.toggle("show");
  $$(".case-radio").forEach(b=>b.onclick=()=>selectSingleCaseAnswer(+b.dataset.choice));
  $$(".case-nav-num").forEach(b=>b.onclick=()=>{caseRun.part=+b.dataset.jumpPart;caseRun.q=+b.dataset.jumpQ;renderCaseQuestion();});
  $("#casePrev").onclick=()=>moveCase(-1);
  $("#caseNext").onclick=()=>moveCase(1);

  if(caseMode==="study" && caseRun.revealed[key]) showStudyFeedback();
}
function selectSingleCaseAnswer(ai){
  const key=caseRun.part+"-"+caseRun.q;
  caseRun.answers[key]=ai;
  $$(".case-radio").forEach((b,i)=>b.classList.toggle("selected",i===ai));
  if(caseMode==="study"){
    caseRun.revealed[key]=true;
    showStudyFeedback();
  }
}
function showStudyFeedback(){
  const p=caseRun.case.parts[caseRun.part],q=p.questions[caseRun.q],key=caseRun.part+"-"+caseRun.q;
  if(caseRun.answers[key]===undefined)return;
  const chosen=caseRun.answers[key],ok=chosen===q.answer;
  $$(".case-radio").forEach((b,i)=>{
    b.disabled=true;
    b.classList.remove("correct","wrong","dim");
    if(i===q.answer)b.classList.add("correct");
    else if(i===chosen)b.classList.add("wrong");
    else b.classList.add("dim");
  });
  $("#singleFeedback").innerHTML='<div class="case-feedback '+(ok?'good':'bad')+'"><b>'+(ok?'✓ Correct':'✗ Review this')+'</b><div>'+q.why+'</div><div class="mini-rule">🧠 '+q.rule+'</div></div>';
}
function moveCase(dir){
  const total=totalCaseQuestions(),global=currentGlobalNumber();
  if(dir>0 && global===total){
    if(Object.keys(caseRun.answers).length<total){toast("You still have unanswered questions.");return;}
    finishCase();
    return;
  }
  if(dir>0){
    if(caseRun.q<caseRun.case.parts[caseRun.part].questions.length-1)caseRun.q++;
    else {caseRun.part++;caseRun.q=0;}
  } else {
    if(caseRun.q>0)caseRun.q--;
    else {caseRun.part--;caseRun.q=caseRun.case.parts[caseRun.part].questions.length-1;}
  }
  renderCaseQuestion();
}
function finishCase(){
  const cc=caseRun.case,total=totalCaseQuestions();
  let score=0,review=[];
  cc.parts.forEach((p,pi)=>p.questions.forEach((q,qi)=>{
    const key=pi+"-"+qi,chosen=caseRun.answers[key],ok=chosen===q.answer;
    if(ok)score++; else review.push({n:(()=>{let n=0;for(let i=0;i<pi;i++)n+=cc.parts[i].questions.length;return n+qi+1})(),q,chosen});
  }));
  const pct=Math.round(score/total*100);
  $("#caseStage").innerHTML='<div class="case-complete"><div class="case-complete-brain">🧠⚡</div><span class="tag priority">CASE COMPLETE</span><h2>'+cc.title+'</h2><div class="case-score-big">'+score+' / '+total+'</div><p>'+pct+'% on this original simulation.</p>'+
    (caseMode==="exam"&&review.length?'<div class="exam-review-list">'+review.map(x=>'<div class="exam-review-item"><b>Question '+x.n+'</b><div>'+x.q.q+'</div><div class="mini-rule">Correct: '+x.q.choices[x.q.answer]+' · '+x.q.rule+'</div></div>').join("")+'</div>':'')+
    '<div class="memory-strip"><div class="memory-title">CASE RULE</div><div class="memory-rule">Keep the reference open when you need it. The question changes; the case is the anchor.</div></div><div class="hero-actions"><button class="cta pink-bg" id="caseAgain">↻ Replay</button><button class="cta green-bg" id="allCases">Choose another</button></div></div>';
  $("#caseAgain").onclick=()=>startCase(cc.id);
  $("#allCases").onclick=()=>{$("#casePicker").style.display="grid";$("#caseStage").classList.add("hidden")};
}
$("[data-case-filter]").forEach(b=>b.onclick=()=>{
  caseFilter=b.dataset.caseFilter;
  $("[data-case-filter]").forEach(x=>x.classList.toggle("selected",x===b));
  renderCases();
});
$("#caseStudyMode").onclick=()=>{caseMode="study";$("#caseStudyMode").classList.add("selected");$("#caseExamMode").classList.remove("selected");toast("Study mode: hints + instant feedback");};
$("#caseExamMode").onclick=()=>{caseMode="exam";$("#caseExamMode").classList.add("selected");$("#caseStudyMode").classList.remove("selected");toast("Exam-like mode: feedback waits until the end");};
$("#randomCase").onclick=()=>startCase(FULL_CASES[Math.floor(Math.random()*FULL_CASES.length)].id);
renderCases();renderHomeStats();setRule();