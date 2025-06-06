import { MentalHealthTopic } from '@/types/user';

export interface CategoryPromptConfig {
  tone: string;
  examples: string[];
  silenceBreakers: string[];
  encouragementPhrases: string[];
  transitionPrompts: string[];
  safetyKeywords: string[];
  guidelines: string[];
}

export const CATEGORY_PROMPTS: Record<MentalHealthTopic, CategoryPromptConfig> = {
  anxiety: {
    tone: "calming, grounding, reassuring",
    examples: [
      "Would anyone like to share what made their heart race today?",
      "Sometimes, even naming the fear helps — does anyone want to try?",
      "You're not alone. Has anyone experienced something similar this week?",
      "What does anxiety feel like in your body right now?",
      "Let's take a moment to breathe together. What helps you feel more grounded?"
    ],
    silenceBreakers: [
      "It's okay to take your time. We're here when you're ready.",
      "Sometimes the quiet moments are important too. How is everyone doing?",
      "No pressure to share, but if something is on your mind, we're listening.",
      "Would it help to talk about what makes it hard to speak up sometimes?"
    ],
    encouragementPhrases: [
      "Thank you for sharing that — it takes courage.",
      "That sounds really challenging. You're handling it with such strength.",
      "I hear how hard this is for you.",
      "Your feelings are completely valid.",
      "You're taking important steps by being here."
    ],
    transitionPrompts: [
      "Does anyone else relate to what was just shared?",
      "What would you want someone to know if they were feeling this way?",
      "How do you usually cope when anxiety feels overwhelming?",
      "What helps you feel safe when worry takes over?"
    ],
    safetyKeywords: ["panic", "can't breathe", "dying", "losing control", "disaster"],
    guidelines: [
      "Focus on grounding techniques and breathing",
      "Normalize physical sensations of anxiety",
      "Encourage small, manageable coping strategies",
      "Avoid minimizing their fears"
    ]
  },

  depression: {
    tone: "gentle, validating, hopeful without toxic positivity",
    examples: [
      "What does hope look like for you today?",
      "Share one small thing that brought you comfort recently.",
      "How do you take care of yourself on difficult days?",
      "What would you want others to know about depression?",
      "Sometimes just getting through the day is enough. How was today for you?"
    ],
    silenceBreakers: [
      "Depression can make it hard to find words. That's okay.",
      "You don't have to have the right words. Just being here matters.",
      "How is everyone's energy today? No judgment, just checking in.",
      "What's one thing that felt manageable today?"
    ],
    encouragementPhrases: [
      "Your pain is real and valid.",
      "You're doing better than you think you are.",
      "Small steps still count as progress.",
      "Thank you for showing up, even when it's hard.",
      "You matter, even when it doesn't feel that way."
    ],
    transitionPrompts: [
      "Has anyone found something that helps on the really tough days?",
      "What does self-compassion look like for you?",
      "How do you handle people who don't understand depression?",
      "What's one thing you wish you could believe about yourself?"
    ],
    safetyKeywords: ["suicide", "ending it", "worthless", "burden", "disappear"],
    guidelines: [
      "Validate their experience without minimizing",
      "Focus on small, achievable goals",
      "Encourage professional support when appropriate",
      "Avoid 'just think positive' language"
    ]
  },

  loneliness: {
    tone: "warm, inviting, connected",
    examples: [
      "Feeling disconnected can be so heavy. What helps you feel a little less alone?",
      "Have you had a moment recently where you wished someone was there?",
      "Even just sharing can remind us we're not invisible. Would anyone like to start?",
      "What does meaningful connection mean to you?",
      "Sometimes loneliness hits even when we're around people. Anyone relate?"
    ],
    silenceBreakers: [
      "Connection can feel scary after being alone for so long. Anyone feeling that?",
      "We're all here together right now. How does that feel?",
      "Sometimes it's easier to connect through shared experiences. What brings you comfort?",
      "What would you want a friend to know about loneliness?"
    ],
    encouragementPhrases: [
      "You're not as alone as you feel.",
      "Thank you for letting us see you.",
      "Your presence here makes a difference.",
      "You deserve connection and belonging.",
      "Being vulnerable takes incredible courage."
    ],
    transitionPrompts: [
      "What makes it hard to reach out to others?",
      "Has anyone found ways to feel connected even when physically alone?",
      "What would ideal support look like for you?",
      "How do you show care for yourself when feeling isolated?"
    ],
    safetyKeywords: ["nobody cares", "invisible", "forgotten", "isolated", "abandon"],
    guidelines: [
      "Create opportunities for group connection",
      "Validate the pain of loneliness",
      "Encourage small social steps",
      "Focus on quality over quantity of connections"
    ]
  },

  stress: {
    tone: "grounded, understanding, practical",
    examples: [
      "What are your biggest stress triggers right now?",
      "Share a time management technique that works for you.",
      "How do you know when you're reaching your limit?",
      "What helps you feel more in control when everything feels chaotic?",
      "If your stress had a voice, what would it be saying?"
    ],
    silenceBreakers: [
      "Sometimes we're too overwhelmed to even talk about it. Anyone feeling that?",
      "Stress can make our minds race. What's racing through yours today?",
      "How is everyone managing their energy today?",
      "What's one thing that's been weighing on your mind?"
    ],
    encouragementPhrases: [
      "You're handling more than most people could.",
      "It's okay to feel overwhelmed by everything on your plate.",
      "Recognizing your stress is the first step.",
      "You don't have to carry it all alone.",
      "Taking time for yourself isn't selfish."
    ],
    transitionPrompts: [
      "What would happen if you let go of one thing today?",
      "How do you prioritize when everything feels urgent?",
      "What boundaries have you learned to set?",
      "What does rest look like for you?"
    ],
    safetyKeywords: ["can't handle", "breaking point", "too much", "failing", "overwhelmed"],
    guidelines: [
      "Focus on practical coping strategies",
      "Help identify manageable first steps",
      "Normalize the need for boundaries",
      "Encourage realistic goal-setting"
    ]
  },

  grief: {
    tone: "respectful, slow, safe",
    examples: [
      "Grief shows up in many forms. How is it showing up for you today?",
      "You can talk — or just sit. Both are okay here.",
      "Would sharing a memory feel helpful right now?",
      "How has grief changed for you over time?",
      "What would you want people to know about your grief?"
    ],
    silenceBreakers: [
      "Grief doesn't follow a timeline. Take all the time you need.",
      "Sometimes there are no words. Your presence here is enough.",
      "How are you honoring your loss today?",
      "What has surprised you most about grief?"
    ],
    encouragementPhrases: [
      "Your grief is a reflection of your love.",
      "There's no right way to grieve.",
      "Your feelings, whatever they are, are valid.",
      "Healing doesn't mean forgetting.",
      "You're allowed to have good days and bad days."
    ],
    transitionPrompts: [
      "How do you want to remember them/it?",
      "What brings you comfort on the hardest days?",
      "How do you handle people who want to 'fix' your grief?",
      "What has helped you feel connected to what you've lost?"
    ],
    safetyKeywords: ["join them", "can't go on", "no point", "empty", "nothing left"],
    guidelines: [
      "Allow long pauses and silence",
      "Don't rush the healing process",
      "Normalize complex emotions",
      "Respect different expressions of grief"
    ]
  },

  relationships: {
    tone: "balanced, non-judgmental, insightful",
    examples: [
      "What makes relationships challenging for you?",
      "How do you set healthy boundaries?",
      "Share about a relationship that taught you something important.",
      "What does good communication look like to you?",
      "How do you handle conflict in relationships?"
    ],
    silenceBreakers: [
      "Relationships can be complicated. What's on your mind today?",
      "How do you know when a relationship is healthy for you?",
      "What patterns do you notice in your relationships?",
      "What would your ideal support look like from others?"
    ],
    encouragementPhrases: [
      "Healthy relationships take practice.",
      "You deserve to be treated with respect.",
      "Your needs in relationships are valid.",
      "Setting boundaries is an act of self-care.",
      "You're learning to advocate for yourself."
    ],
    transitionPrompts: [
      "How do you maintain your identity in relationships?",
      "What have you learned about forgiveness?",
      "How do you handle rejection or disappointment?",
      "What does interdependence mean to you?"
    ],
    safetyKeywords: ["abuse", "control", "trapped", "scared", "unsafe"],
    guidelines: [
      "Encourage healthy boundary-setting",
      "Validate their relationship experiences",
      "Focus on communication skills",
      "Support their autonomy and choices"
    ]
  },

  self_esteem: {
    tone: "encouraging, validating, gentle",
    examples: [
      "What's one thing you wish you believed about yourself?",
      "Has your inner critic been loud today? What did it say?",
      "How do you show kindness to others — and can you give a little to yourself too?",
      "What would you tell your younger self?",
      "Share something you're proud of about yourself."
    ],
    silenceBreakers: [
      "Self-worth can feel like such a foreign concept sometimes. Anyone relate?",
      "What does your inner voice sound like today?",
      "How do you practice self-compassion?",
      "What makes it hard to see your own value?"
    ],
    encouragementPhrases: [
      "You are worthy exactly as you are.",
      "Your worth isn't determined by your productivity.",
      "You don't have to earn love or belonging.",
      "Your inner critic isn't telling the truth.",
      "You're allowed to take up space."
    ],
    transitionPrompts: [
      "How do you challenge negative self-talk?",
      "What would unconditional self-acceptance look like?",
      "How do you separate your worth from others' opinions?",
      "What strengths do you see in others that you might have too?"
    ],
    safetyKeywords: ["worthless", "failure", "not enough", "hate myself", "stupid"],
    guidelines: [
      "Challenge negative self-talk gently",
      "Encourage self-compassion practices",
      "Help identify personal strengths",
      "Normalize the journey of self-acceptance"
    ]
  },

  trauma: {
    tone: "gentle, safe, empowering",
    examples: [
      "What does feeling safe mean to you?",
      "Share a small step you've taken in healing.",
      "How do you practice self-care on difficult days?",
      "What strength have you discovered in yourself?",
      "How do you honor your journey of healing?"
    ],
    silenceBreakers: [
      "Healing happens at your own pace. There's no rush here.",
      "How are you feeling in your body right now?",
      "What do you need to feel safe in this moment?",
      "You're the expert on your own experience."
    ],
    encouragementPhrases: [
      "You survived something really difficult.",
      "Your healing journey is yours to define.",
      "You have more strength than you realize.",
      "You deserve to feel safe and supported.",
      "Recovery isn't linear, and that's okay."
    ],
    transitionPrompts: [
      "What does safety feel like in your body?",
      "How do you reconnect with yourself after difficult moments?",
      "What boundaries have become important to you?",
      "How do you handle triggers when they come up?"
    ],
    safetyKeywords: ["flashback", "triggered", "unsafe", "reliving", "panic"],
    guidelines: [
      "Prioritize safety and consent",
      "Respect their pace and boundaries",
      "Focus on empowerment and choice",
      "Normalize trauma responses"
    ]
  },

  addiction: {
    tone: "non-judgmental, hopeful, honest",
    examples: [
      "What does recovery mean to you?",
      "Share a healthy coping strategy you've developed.",
      "How do you handle difficult moments without using?",
      "What motivates you to keep going in recovery?",
      "What would you want others to know about addiction?"
    ],
    silenceBreakers: [
      "Recovery looks different for everyone. How does yours look today?",
      "What's been challenging about staying clean/sober lately?",
      "How do you handle cravings when they hit?",
      "What does support mean to you in recovery?"
    ],
    encouragementPhrases: [
      "One day at a time is enough.",
      "Recovery is brave work.",
      "Relapse doesn't erase your progress.",
      "You're worth fighting for.",
      "Your recovery matters."
    ],
    transitionPrompts: [
      "What triggers do you watch out for?",
      "How has your relationship with yourself changed in recovery?",
      "What does accountability look like for you?",
      "How do you celebrate small victories in recovery?"
    ],
    safetyKeywords: ["relapse", "using", "craving", "can't handle", "give up"],
    guidelines: [
      "Normalize the challenges of recovery",
      "Encourage professional support",
      "Focus on harm reduction and safety",
      "Celebrate progress, not perfection"
    ]
  },

  workplace_burnout: {
    tone: "grounded, relieving, honest",
    examples: [
      "If your body could speak right now, what would it say about work?",
      "Describe your typical workday in one word.",
      "Burnout can feel invisible. What do you wish people understood?",
      "What does work-life balance look like for you?",
      "How do you recognize when you're burning out?"
    ],
    silenceBreakers: [
      "Work stress can be so isolating. How are you managing yours?",
      "What boundaries have you tried to set at work?",
      "How do you decompress after a difficult workday?",
      "What would your ideal work situation look like?"
    ],
    encouragementPhrases: [
      "Your worth isn't measured by your productivity.",
      "It's okay to not love your job.",
      "You're allowed to prioritize your well-being.",
      "Burnout is real and it's not your fault.",
      "You deserve to feel fulfilled in your work."
    ],
    transitionPrompts: [
      "What would happen if you said 'no' more often at work?",
      "How do you separate your identity from your job?",
      "What gives you energy outside of work?",
      "How do you handle workplace pressure or demands?"
    ],
    safetyKeywords: ["can't cope", "breaking down", "hate job", "trapped", "exhausted"],
    guidelines: [
      "Validate work-related stress",
      "Encourage boundary-setting",
      "Focus on sustainable work practices",
      "Support career reflection and choices"
    ]
  }
};

export const GENERAL_SAFETY_RESPONSES = [
  "I'm noticing some distress in what you shared. You're not alone, and it's important that you stay safe.",
  "What you're experiencing sounds really intense. Do you have support available to you right now?",
  "Thank you for trusting us with something so difficult. Have you been able to talk to a professional about this?",
  "I want to make sure you're safe. If you're having thoughts of hurting yourself, please reach out to a crisis line or emergency services.",
  "You matter and your life has value. If you're in crisis, please contact emergency services or a suicide prevention hotline."
];

export const RESPONSE_TIMING = {
  // Therapy Session Mode (Structured, time-limited sessions)
  THERAPY_SESSION: {
    SILENCE_THRESHOLD_MS: 5000, // 5 seconds of silence
    REGULAR_INTERVAL_MS: 60000, // 60 seconds regular check-in
    DISTRESS_RESPONSE_MS: 2000, // 2 seconds when distress detected
    MAX_CONSECUTIVE_AI_MESSAGES: 2 // Don't send more than 2 AI messages in a row
  },
  
  // Community Chat Mode (Always-active, Reddit-style groups)
  COMMUNITY_CHAT: {
    SILENCE_THRESHOLD_MS: 300000, // 5 minutes of silence (more patient)
    REGULAR_INTERVAL_MS: 1800000, // 30 minutes regular check-in (less frequent)
    DISTRESS_RESPONSE_MS: 2000, // Still respond quickly to distress
    MAX_CONSECUTIVE_AI_MESSAGES: 1 // Be less intrusive in casual chat
  }
};

export const getPromptConfig = (category: MentalHealthTopic): CategoryPromptConfig => {
  return CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS.anxiety;
};

export const getRandomExample = (category: MentalHealthTopic): string => {
  const config = getPromptConfig(category);
  return config.examples[Math.floor(Math.random() * config.examples.length)];
};

export const getRandomSilenceBreaker = (category: MentalHealthTopic): string => {
  const config = getPromptConfig(category);
  return config.silenceBreakers[Math.floor(Math.random() * config.silenceBreakers.length)];
};

export const getRandomEncouragement = (category: MentalHealthTopic): string => {
  const config = getPromptConfig(category);
  return config.encouragementPhrases[Math.floor(Math.random() * config.encouragementPhrases.length)];
};

export const getRandomTransition = (category: MentalHealthTopic): string => {
  const config = getPromptConfig(category);
  return config.transitionPrompts[Math.floor(Math.random() * config.transitionPrompts.length)];
};

// Community Chat specific prompts (more casual, less frequent)
export const COMMUNITY_CHAT_PROMPTS = {
  WELCOME_MESSAGES: [
    "Welcome to the community! Feel free to share what's on your mind.",
    "This is a safe space for support and connection. What brings you here today?",
    "Great to see some activity here! How is everyone doing?",
  ],
  
  CASUAL_CHECK_INS: [
    "How's everyone's week going so far?",
    "Anyone want to share a small win from today?",
    "What's been on your mind lately?",
    "How are you taking care of yourself this week?",
  ],
  
  LONG_SILENCE_BREAKERS: [
    "The community has been quiet lately. How is everyone doing?",
    "Sometimes it's nice to just know others are here. Sending support to everyone.",
    "Feel free to share if something is weighing on you. We're here to listen.",
    "Reminder that this is a judgment-free space for support and connection.",
  ]
};

export const getCommunityPrompt = (type: 'welcome' | 'check_in' | 'silence'): string => {
  switch (type) {
    case 'welcome':
      return COMMUNITY_CHAT_PROMPTS.WELCOME_MESSAGES[
        Math.floor(Math.random() * COMMUNITY_CHAT_PROMPTS.WELCOME_MESSAGES.length)
      ];
    case 'check_in':
      return COMMUNITY_CHAT_PROMPTS.CASUAL_CHECK_INS[
        Math.floor(Math.random() * COMMUNITY_CHAT_PROMPTS.CASUAL_CHECK_INS.length)
      ];
    case 'silence':
      return COMMUNITY_CHAT_PROMPTS.LONG_SILENCE_BREAKERS[
        Math.floor(Math.random() * COMMUNITY_CHAT_PROMPTS.LONG_SILENCE_BREAKERS.length)
      ];
    default:
      return COMMUNITY_CHAT_PROMPTS.CASUAL_CHECK_INS[0];
  }
}; 