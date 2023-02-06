export const CARD_COLORS = [
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
];

export const CARD_HOVER_COLORS = [
  '#a7e4fc',
  '#695f9b',
  '#fcb34c',
  '#abd261',
  '#f3715b',
];

export const GROUP_FONT_COLORS = [
  '#0B6623',
  '#F79722',
  '#8A38F5',
  '#abd261',
  '#f3715b',
];

export const GROUP_COLORS = [
  '#E2EBE5',
  '#fcf2e6',
  '#F5F1FB',
  '#abd261',
  '#f3715b',
];

export interface pulseCheckInterface {
  id: string;
  name: string;
  description: string;
  pulseCheckImage: string;
  value: Array<string>;
  valueDescription: Array<string>;
  checked: boolean;
}

export const RETRONAME_CHARACTER_LIMIT = 80;

export const AVATAR_CHARACTER_LIMIT = 30;

export const UNGROUPED = 'Ungrouped';

export const templatesData = [
  {
    templateId: '4l_retrospective',
    templateName: '4L Retrospective',
    templateDescription:
      'For the team to share how they feel in a structured manner and capture key learnings and ideas to progress.',
    templateImage: '/images/coming_soon.png',
    checked: false,
    columns: [
      {
        id: '0',
        name: 'What went well',
        order: 0,
        cardColor: CARD_COLORS[0],
        cardColorHover: CARD_HOVER_COLORS[0],
        groupColor: GROUP_COLORS[0],
        groupFontColor: GROUP_FONT_COLORS[0],
        groups: [
          {
            id: UNGROUPED + 1,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '1',
        name: `What didn't go well`,
        order: 1,
        cardColor: CARD_COLORS[1],
        cardColorHover: CARD_HOVER_COLORS[1],
        groupColor: GROUP_COLORS[1],
        groupFontColor: GROUP_FONT_COLORS[1],
        groups: [
          {
            id: UNGROUPED + 2,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '2',
        name: 'Develop Actions',
        order: 2,
        cardColor: CARD_COLORS[2],
        cardColorHover: CARD_HOVER_COLORS[2],
        groupColor: GROUP_COLORS[2],
        groupFontColor: GROUP_FONT_COLORS[2],
        groups: [
          {
            id: UNGROUPED + 3,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
    ],
  },
  {
    templateId: 'start_stop_continue',
    templateName: 'Start, Stop , Continue',
    templateDescription:
      'The traffic light retro gives everyone in the team an opportunity to talk and quickly identify bottlenecks.',
    templateImage: '/images/coming_soon.png',
    checked: false,
    columns: [
      {
        id: '0',
        name: 'What went well',
        order: 0,
        cardColor: CARD_COLORS[0],
        cardColorHover: CARD_HOVER_COLORS[0],
        groupColor: GROUP_COLORS[0],
        groupFontColor: GROUP_FONT_COLORS[0],
        groups: [
          {
            id: UNGROUPED + 1,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '1',
        name: `What didn't go well`,
        order: 1,
        cardColor: CARD_COLORS[1],
        cardColorHover: CARD_HOVER_COLORS[1],
        groupColor: GROUP_COLORS[1],
        groupFontColor: GROUP_FONT_COLORS[1],
        groups: [
          {
            id: UNGROUPED + 2,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '2',
        name: 'Develop Actions',
        order: 2,
        cardColor: CARD_COLORS[2],
        cardColorHover: CARD_HOVER_COLORS[2],
        groupColor: GROUP_COLORS[2],
        groupFontColor: GROUP_FONT_COLORS[2],
        groups: [
          {
            id: UNGROUPED + 3,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
    ],
  },
  {
    templateId: 'sailboat',
    templateName: 'Sailboat',
    templateDescription:
      'A fun way to think differently and reflect on the bigger picture.',
    templateImage: '/images/coming_soon.png',
    checked: false,
    columns: [
      {
        id: '0',
        name: 'What went well',
        order: 0,
        cardColor: CARD_COLORS[0],
        cardColorHover: CARD_HOVER_COLORS[0],
        groupColor: GROUP_COLORS[0],
        groupFontColor: GROUP_FONT_COLORS[0],
        groups: [
          {
            id: UNGROUPED + 1,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '1',
        name: `What didn't go well`,
        order: 1,
        cardColor: CARD_COLORS[1],
        cardColorHover: CARD_HOVER_COLORS[1],
        groupColor: GROUP_COLORS[1],
        groupFontColor: GROUP_FONT_COLORS[1],
        groups: [
          {
            id: UNGROUPED + 2,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '2',
        name: 'Develop Actions',
        order: 2,
        cardColor: CARD_COLORS[2],
        cardColorHover: CARD_HOVER_COLORS[2],
        groupColor: GROUP_COLORS[2],
        groupFontColor: GROUP_FONT_COLORS[2],
        groups: [
          {
            id: UNGROUPED + 3,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
    ],
  },
  {
    templateId: 'simple',
    templateName: 'Simple',
    templateDescription: 'A classic template for retros.',
    templateImage: '/images/defaultRetroTemplate.png',
    checked: true,
    columns: [
      {
        id: '0',
        name: 'What went well',
        order: 0,
        cardColor: CARD_COLORS[0],
        cardColorHover: CARD_HOVER_COLORS[0],
        groupColor: GROUP_COLORS[0],
        groupFontColor: GROUP_FONT_COLORS[0],
        groups: [
          {
            id: UNGROUPED + 1,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '1',
        name: `What didn't go well`,
        order: 1,
        cardColor: CARD_COLORS[1],
        cardColorHover: CARD_HOVER_COLORS[1],
        groupColor: GROUP_COLORS[1],
        groupFontColor: GROUP_FONT_COLORS[1],
        groups: [
          {
            id: UNGROUPED + 2,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '2',
        name: 'Develop Actions',
        order: 2,
        cardColor: CARD_COLORS[2],
        cardColorHover: CARD_HOVER_COLORS[2],
        groupColor: GROUP_COLORS[2],
        groupFontColor: GROUP_FONT_COLORS[2],
        groups: [
          {
            id: UNGROUPED + 3,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
    ],
  },
];

export const pulseChecksData: pulseCheckInterface[] = [
  {
    id: 'simple',
    name: 'Simple (3 Questions)',
    description:
      'An oldie but a goodie, also known as the PPT Framework created in the 60s, it has long been the benchmark to understanding workforce management.',
    pulseCheckImage: '/images/coming_soon.png',
    checked: true,
    value: [
      '1. People & Resources ',
      '2. Work Processes ',
      '3. Technical Tools ',
    ],
    valueDescription: [
      'Your team maintains clear roles & decision making, adequate funding, efficient team structure, adequate skills & capabilities, great career opportunities, and active knowledge share',
      'Your team maintains clear goal setting, frequent planning and prioritisation, regular feedback loops, quick test and learn, and consistent cadence & transparency of work',
      'Your team has the necessary tools to collaborate and work efficiently, and a modular architecture that minimise dependency and maximise delivery',
    ],
  },
  {
    id: 'business_agility',
    name: 'Business Agility  (7 Questions)',
    description:
      'An oldie but a goodie, also known as the PPT Framework created in the 60s, it has long been the benchmark to understanding workforce management.',
    pulseCheckImage: '/images/coming_soon.png',
    checked: false,
    value: [
      '1. Individual and Team Goals',
      '2. People and Resources',
      '3. Team Structure and Capabilities',
      '4. Decision Making (Individual and Team)',
      '5. Openness to Feedback & Test and Learn',
      '6. Work Prioritisation',
      '7. Work Technology and Tools',
    ],
    valueDescription: [
      'You have a clear understanding of your personal & team short-term goals, and they are all aligned to our ultimate mission',
      'Your team have adequate number of people & funding to deliver on your goals',
      'You have a simple team structure that allows you to work autonomously & with the right set of capabilities and skills to deliver',
      'Your team have people with clear roles empowered to make decisions & you are supported with the right career opportunities',
      'You are free to give each other feedback, open to test & learn, and not afraid to make a mistake or fail',
      'Your team has a regular cadence to plan & prioritise work, and to change quickly if the workload is not sustainable',
      'You have the necessary technological tools and modular architecture to foster minimum dependencies and maximum collaboration & delivery',
    ],
  },
  {
    id: 'pulse_check_not_req',
    name: 'Pulse Check Not Required',
    description:
      'An oldie but a goodie, also known as the PPT Framework created in the 60s, it has long been the benchmark to understanding workforce management.',
    pulseCheckImage: '/images/coming_soon.png',
    checked: false,
    value: [],
    valueDescription: [],
  },
];
