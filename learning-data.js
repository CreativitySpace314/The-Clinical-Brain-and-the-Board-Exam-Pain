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

const SOURCE_CHECKS = [
  {
    status:"verified",
    icon:"✅",
    title:"Former client / family-member romance: 5-year prohibition",
    source:"ACA A.5.c",
    exam:"Do not date a former client, the former client's romantic partner, or family member until at least 5 years after last professional contact.",
    nuance:"After 5 years, it is still not automatically okay: the counselor must consider exploitation or harm and document that analysis."
  },
  {
    status:"verified",
    icon:"✅",
    title:"Bartering has three core conditions",
    source:"ACA A.10.e",
    exam:"Bartering may occur only when the client requests it, it does not cause exploitation or harm, and it is accepted among professionals in the community.",
    nuance:"The Code also says to consider cultural implications and document the agreement in a clear written contract."
  },
  {
    status:"caution",
    icon:"⚠️",
    title:"Economic hardship: 'may adjust' — not 'must provide pro bono'",
    source:"ACA A.10.c",
    exam:"The practice-test key may push toward fee adjustment or affordable referral when hardship exists.",
    nuance:"The actual ACA language says counselors MAY adjust fees when legally permissible OR help the client locate comparable affordable services. It does not require a sliding scale or pro bono care in every hardship case."
  },
  {
    status:"caution",
    icon:"⚠️",
    title:"Collections are not limited only to 'unwillingness' to pay",
    source:"ACA A.10.d",
    exam:"The exam may contrast hardship-sensitive responses with immediate collections.",
    nuance:"ACA says that if a counselor intends to use collections/legal measures for unpaid agreed fees, that policy must be in informed consent, the client must be informed in a timely way, and offered an opportunity to pay."
  },
  {
    status:"verified",
    icon:"✅",
    title:"Values alone are not a referral reason",
    source:"ACA A.11.b",
    exam:"Do not refer or terminate solely because the counselor's personal values conflict with the client's values.",
    nuance:"Seek training and avoid imposing values."
  },
  {
    status:"verified",
    icon:"✅",
    title:"Court order ≠ 'dump the whole file'",
    source:"ACA B.2.d / B.2.e",
    exam:"When disclosure is legally compelled, attempt to obtain consent or limit/prohibit the disclosure, and release only essential information.",
    nuance:"A subpoena and a court order are not identical. The ethical response is procedural and narrow."
  },
  {
    status:"verified",
    icon:"✅",
    title:"Couples: define who the client is",
    source:"ACA B.4.b",
    exam:"In couples/family work, explicitly define who is considered the client and document expectations and limits of confidentiality.",
    nuance:"Absent an agreement otherwise, ACA treats the couple/family as the client."
  },
  {
    status:"caution",
    icon:"⚠️",
    title:"Supervision problems usually require evaluation + remediation before dismissal",
    source:"ACA F.6.a–F.6.b",
    exam:"Protect client welfare when a supervisee is unsafe or persistently ineffective.",
    nuance:"ACA calls for ongoing evaluation, documented feedback, remedial assistance when needed, and dismissal when the supervisee cannot demonstrate competent services. 'Immediate termination' is not the universal first step."
  },
  {
    status:"verified",
    icon:"✅",
    title:"Public presentations: literature + no implied counseling relationship",
    source:"ACA C.6.c",
    exam:"Public statements should be grounded in appropriate professional counseling literature and consistent with the Code.",
    nuance:"Recipients should not be led to believe a professional counseling relationship has been established."
  }
];

const MASTER_GUIDE_LESSONS = [
  {icon:"🧒",title:"Peds: age rules matter",rule:"Before choosing a differential, check whether the diagnosis is even developmentally available.",example:"Antisocial personality disorder is not diagnosed in clients under 18. For a child with severe aggression, consider developmentally plausible alternatives such as conduct disorder, mood disorders, trauma, or neurodevelopmental conditions."},
  {icon:"🎮",title:"Low engagement: join before you process",rule:"Interest-based rapport often beats confronting resistance during initial engagement.",example:"A child absorbed in a game guide may engage more if you first talk about the interest rather than immediately asking why they will not participate."},
  {icon:"🫁",title:"Acute dysregulation: concrete first",rule:"When the client is actively dysregulated, choose a usable regulation skill before a long-range relational lesson.",example:"Breathing, grounding, or progressive muscle relaxation can fit the immediate moment better than perspective-taking."},
  {icon:"📋",title:"Assessment: population fit first",rule:"Age + construct + purpose determine the instrument.",example:"Adult ADHD screening calls for an adult-validated measure; do not choose a pediatric scale because the disorder starts in childhood."},
  {icon:"🧠",title:"MSE: put the sign in the right bucket",rule:"Mood, affect, thought process, thought content, perception, psychomotor activity, orientation, memory, insight, and judgment are different lanes.",example:"Fidgeting is psychomotor behavior; guilt/anxiety are mood content; paranoia is thought content."},
  {icon:"🧯",title:"DBT hierarchy",rule:"Life-threatening behaviors → therapy-interfering behaviors → quality-of-life targets.",example:"If active self-harm is present, that outranks improving relationship satisfaction."},
  {icon:"🧊",title:"DBT distress tolerance",rule:"Know the skill family, not just the buzzword.",example:"TIPP, self-soothing, and pros/cons belong in distress tolerance. Thought stopping is not a core DBT distress-tolerance skill."},
  {icon:"👥",title:"Group structure can be the intervention",rule:"If someone cannot get space to participate, use structure.",example:"Rounds, dyads, or appropriately cutting off monopolizing can create actual speaking space; active listening alone may not."},
  {icon:"💞",title:"Gottman: flooding changes the next move",rule:"Stonewalling/flooding → communicate overwhelm + take a structured break + return.",example:"Do not force emotional processing while one partner is physiologically flooded."},
  {icon:"⬇️",title:"Downward arrow",rule:"Ask what the automatic thought would MEAN if it were true.",example:"'If my partner is not attracted to me, what does that mean about me/us?' traces toward a core schema."},
  {icon:"🍽️",title:"Eating disorders: think team + medical risk",rule:"Medical stability and interdisciplinary coordination shape level-of-care decisions.",example:"Counselor, medical provider, and nutrition professional often need coordinated roles; new syncope, cardiac instability, or electrolyte disturbance changes urgency."},
  {icon:"🧬",title:"Genogram = pattern map",rule:"Use a genogram when the question is about intergenerational family/relationship patterns.",example:"A symptom scale measures symptoms; a genogram maps relational structure across generations."}
];