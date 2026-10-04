const FEEDBACK_LESSONS = [
  {
    id:"sequence",
    icon:"🚦",
    title:"Do the next right thing — not the fanciest thing",
    color:"hot",
    rule:"FIRST / NEXT / MOST helpful usually rewards the intervention that fits the client's CURRENT stage.",
    learn:"Several misses came from choosing a clinically reasonable answer that jumped ahead. Build rapport before processing resistance. Stabilize before deep exploration. Use the client's immediate treatment target before a later-stage goal.",
    traps:["Jumping to a later phase","Choosing the most sophisticated intervention","Solving a future problem instead of today's task"],
    checkpoint:"Ask: What has already happened? What has NOT happened yet?"
  },
  {
    id:"emotion-belief",
    icon:"💗",
    title:"Validate emotion ≠ validate the belief",
    color:"lime",
    rule:"You can validate fear, shame, grief, anger, or distress without confirming an inaccurate conclusion.",
    learn:"When a client is highly activated, attune and regulate first. Then collaboratively examine evidence. Avoid either extreme: arguing with the client OR agreeing with a distorted belief just to sound empathic.",
    traps:["Supporting the belief instead of the feeling","Challenging too early","Using 'genuine' as a reason to reinforce distortion"],
    checkpoint:"Can I say 'your feeling makes sense' without saying 'your conclusion is true'?"
  },
  {
    id:"theory",
    icon:"🧰",
    title:"Know the fingerprint of each theory",
    color:"cyan",
    rule:"Helpful ≠ belongs to the theory named in the question.",
    learn:"Your misses repeatedly involved techniques that are useful but belong to a different model. Learn the signature moves: MI evokes autonomy; CBT tests thoughts and behavior; DBT teaches mindfulness/distress tolerance/emotion regulation/interpersonal effectiveness; narrative re-authors stories; Gottman targets friendship, fondness, repair, flooding, and conflict patterns.",
    traps:["Picking a helpful skill from the wrong modality","Confusing guided discovery with downward arrow","Calling acceptance a CBT restructuring technique"],
    checkpoint:"If the theory name vanished, would I still know which technique belongs to it?"
  },
  {
    id:"differential",
    icon:"🔎",
    title:"Differential diagnosis = plausible alternatives, not random disorders",
    color:"orange",
    rule:"Use age, developmental course, symptom overlap, timeline, and exclusion criteria.",
    learn:"The feedback repeatedly punished choices that looked symptomatically similar but did not fit age, developmental course, or the actual presentation. Think: 'What else realistically explains THIS pattern in THIS person?'",
    traps:["Ignoring age cutoffs","Choosing a disorder because one symptom overlaps","Forgetting medical/substance explanations"],
    checkpoint:"Is this alternative actually plausible for this age + timeline + symptom cluster?"
  },
  {
    id:"assessment",
    icon:"📏",
    title:"Match the assessment to age + construct + purpose",
    color:"violet",
    rule:"QUESTION → CONSTRUCT → POPULATION → TOOL.",
    learn:"Assessment questions were not asking which tool sounds familiar. They were asking which tool actually measures the target construct in the right population and context.",
    traps:["Using a child scale for an adult","Using a broad relationship tool when a genogram answers the real question","Choosing a trauma tool when the timeline no longer fits the condition"],
    checkpoint:"What exact question am I trying to answer with this instrument?"
  },
  {
    id:"goals",
    icon:"🎯",
    title:"Goal, intervention, case-management task — know the difference",
    color:"blue",
    rule:"A counseling goal should be client-centered, clinically relevant, and inside the counselor's scope.",
    learn:"Some misses came from choosing symptom data when the question asked for the client's own goal, or choosing housing/case-management outcomes that were outside the counselor's treatment scope.",
    traps:["Counselor action disguised as a client goal","Long-term goal chosen for the first month","Case-management need treated as psychotherapy objective"],
    checkpoint:"Whose action is this, and is it actually the target of counseling?"
  },
  {
    id:"ethics",
    icon:"⚖️",
    title:"Ethics questions are usually procedural",
    color:"hot",
    rule:"Consent → authority → minimum necessary disclosure → documentation → consultation when unclear.",
    learn:"Your feedback hit fees, collections, couples records, public speaking, referrals, termination, values, confidentiality, and bartering. The strongest answer often follows an ethical PROCESS rather than an absolute rule.",
    traps:["Assuming subpoena = automatic release","Ending care because of counselor values","Using client recruitment/marketing benefit as an ethical factor","Skipping informed-consent terms"],
    checkpoint:"What process protects client autonomy, confidentiality, and continuity of care?"
  },
  {
    id:"distortions",
    icon:"🪞",
    title:"Cognitive distortions need precision",
    color:"lime",
    rule:"Name what the thought is DOING, not merely how negative it sounds.",
    learn:"Jumping to conclusions, overgeneralization, emotional reasoning, catastrophizing, labeling, and personalization overlap. Use the mechanism: prediction without evidence, one event applied broadly, feeling = fact, worst-case escalation, identity label, or taking inappropriate responsibility.",
    traps:["Calling every negative prediction catastrophizing","Confusing overgeneralization with fortune telling","Confusing emotional reasoning with 'should' statements"],
    checkpoint:"What logical move did the thought make?"
  },
  {
    id:"supports",
    icon:"🕸️",
    title:"Build independence, not therapy dependence",
    color:"cyan",
    rule:"At maintenance/termination, strengthen natural and external supports.",
    learn:"When the client is doing well, the best next step may be support groups, community resources, coping systems, or relapse planning—not simply reassuring them that therapy will always be available.",
    traps:["Making the counselor the main safety net","Introducing brand-new treatment at termination","Ignoring external supports"],
    checkpoint:"Does this answer help the client function without needing me?"
  },
  {
    id:"wording",
    icon:"🚨",
    title:"BEST / MOST / FIRST / EXCEPT changes the task",
    color:"orange",
    rule:"Before reading choices, translate the stem into plain English.",
    learn:"Many of the missed items were not pure knowledge gaps. The distractors were clinically possible. The exam wanted the most immediate, most relevant, or least appropriate option.",
    traps:["Answering 'what could help?' when asked 'what helps FIRST?'","Missing EXCEPT","Choosing a true statement that does not answer the exact question"],
    checkpoint:"Finish this sentence: 'They are specifically asking me to choose ____.'"
  }
];

const FEEDBACK_MICRODRILLS = [
 {lesson:"sequence",q:"A guarded adolescent stares at a game guide and barely answers you. Parents are providing history. What is the BEST immediate move?",choices:["Continue only with the parents","Use the client's interest to make a low-pressure connection","Process why the client is resistant","Begin treatment-plan goals"],answer:1,why:"The immediate task is engagement. A simple connection through the client's current interest fits the stage."},
 {lesson:"emotion-belief",q:"A trauma survivor says, 'Because my roommate borrowed something without asking, she will eventually hurt me.' What is the BEST response?",choices:["Agree because trauma survivors should trust every fear","Tell her the belief is irrational","Validate the fear and collaboratively compare current evidence with past danger","Ignore the thought and teach breathing only"],answer:2,why:"Validate the emotional response while examining the conclusion collaboratively."},
 {lesson:"theory",q:"Which intervention is MOST clearly motivational interviewing?",choices:["Explore the client's own reasons for change and support autonomy","Challenge a cognitive distortion with evidence","Teach TIPP","Trace a core belief using downward arrow"],answer:0,why:"MI emphasizes autonomy, evocation, collaboration, and the client's own reasons for change."},
 {lesson:"differential",q:"A 13-year-old has repeated aggression and serious rule violations. Which diagnosis is NOT appropriate solely because of age requirements?",choices:["Conduct disorder","Major depressive disorder","Antisocial personality disorder","Trauma-related disorder"],answer:2,why:"Antisocial personality disorder is not diagnosed before age 18; developmental context matters."},
 {lesson:"assessment",q:"A 25-year-old is being evaluated for ADHD. What principle comes FIRST when selecting a measure?",choices:["Use the scale you remember best","Pick the longest inventory","Confirm it is validated for adults and measures the target construct","Use a child scale because ADHD begins in childhood"],answer:2,why:"Age/population fit and construct validity come before familiarity."},
 {lesson:"goals",q:"A client in a shelter says she wants to make friends and also needs permanent housing. Which is the clearest psychotherapy goal?",choices:["Obtain an apartment","Make friends and build social connection","Complete the housing application for her","Secure a voucher"],answer:1,why:"Social connection is a client-centered clinical goal; housing procurement is primarily case management."},
 {lesson:"ethics",q:"A former client has unpaid fees. Which is the BEST ethical starting point?",choices:["Immediately send the account to collections","Review the informed-consent agreement and communicate about payment options","Terminate all future contact","Postpone documentation until payment is made"],answer:1,why:"Fees and collection practices should follow informed-consent terms and ethical process."},
 {lesson:"distortions",q:"A client says, 'I struggled at this job, so I will fail at every future job.' What is the BEST label?",choices:["Emotional reasoning","Overgeneralization","Personalization","Labeling"],answer:1,why:"One experience is being generalized across future situations."},
 {lesson:"supports",q:"A client is ready to end therapy but fears relapse. Which option BEST strengthens independence?",choices:["Promise immediate weekly therapy forever","Connect relapse planning with natural/community supports and clear re-entry options","Introduce a brand-new modality","Tell the client not to worry"],answer:1,why:"Maintenance emphasizes external supports, skills, and a plan for future help if needed."},
 {lesson:"wording",q:"All are reasonable short-term interventions EXCEPT:",choices:["Teach one coping skill","Collect baseline data","Address the immediate functional problem","Resolve a lifelong family pattern completely in one month"],answer:3,why:"EXCEPT asks for the least appropriate option; the lifespan-level target is mismatched to the timeframe."}
];