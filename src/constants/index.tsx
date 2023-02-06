// export const productName = 'Team Coach';
// export const productWebsite = 'http://www.retroland.com';
export const UNGROUPED = 'Ungrouped';
// export const API_URL = 'http://localhost:5010';

import StarIcon from '@mui/icons-material/Star';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { Icon } from '@mui/material';
import * as Icons from 'heroicons-react';
import { FEATURE_FLAGS_SET } from './FeatureFlags';

export const CARD_COLOURS = [
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
];

export const CARD_HOVER_COLOURS = [
  '#a7e4fc',
  '#695f9b',
  '#fcb34c',
  '#abd261',
  '#f3715b',
];

export const GROUP_FONT_COLOURS = [
  '#0B6623',
  '#F79722',
  '#8A38F5',
  '#abd261',
  '#f3715b',
];

export const GROUP_COLOURS = [
  '#E2EBE5',
  '#fcf2e6',
  '#F5F1FB',
  '#abd261',
  '#f3715b',
];

export const FEATURE_FLAGS = FEATURE_FLAGS_SET;

export const FEEDBACK_QUESTIONS = [
  'Every participant had a fair chance to speak and participate',
  'Team was tackling the most important issues',
  'Actions were prioritised and assigned owners to complete',
];

export const FEEDBACK_QUESTIONS_COLORS = ['#FCB34C', '#FCB34C', '#FCB34C'];

export const FEEDBACK_QUESTIONS_OUTLINE = [
  <Icons.StarOutline size={20} />,
  <Icons.StarOutline size={20} />,
  <Icons.StarOutline size={20} />,
];

export const FEEDBACK_QUESTIONS_FILLED = [
  <Icons.Star size={20} />,
  <Icons.Star size={20} />,
  <Icons.Star size={20} />,
];

export const PULSE_CHECK_QUESTIONS = [
  'Individual and Team Goals',
  'People and Resources',
  'Team Structure and Capabilities',
  'Decision Making (Individual and Team)',
  'Openness to Feedback & Test and Learn',
  'Work Prioritisation',
  'Work Technology and Tools',
];

export const PULSE_CHECK_QUESTIONS_INFO = [
  'You have a clear understanding of your personal & team short-term goals, and they are all aligned to our ultimate mission',
  'Your team have adequate number of people & funding to deliver on your goals',
  'You have a simple team structure that allows you to work autonomously & with the right set of capabilities and skills to deliver',
  'Your team have people with clear roles empowered to make decisions & you are supported with the right career opportunities',
  'You are free to give each other feedback, open to test & learn, and not afraid to make a mistake or fail',
  'Your team has a regular cadence to plan & prioritise work, and to change quickly if the workload is not sustainable',
  'You have the necessary technological tools and modular architecture to foster minimum dependencies and maximum collaboration & delivery',
];

export const QUICK_PULSE_CHECK_QUESTIONS = [
  '1. People & Resources ',
  '2. Work Processes ',
  '3. Technical Tools ',
];

export const QUICK_PULSE_CHECK_QUESTIONS_INFO = [
  'Your team maintains clear roles & decision making, adequate funding, efficient team structure, adequate skills & capabilities, great career opportunities, and active knowledge share',
  'Your team maintains clear goal setting, frequent planning and prioritisation, regular feedback loops, quick test and learn, and consistent cadence & transparency of work',
  'Your team has the necessary tools to collaborate and work efficiently, and a modular architecture that minimise dependency and maximise delivery',
];

export const MAX_CARD_TEXT_LENGTH = 150;

export const WORD_CLOUD_IGNORE_WORDS = ['not', 'its', 'when', 'where'];

export const INITIAL_COLUMNS = [
  {
    id: '0',
    name: 'What went well',
    order: 0,
    cardColour: CARD_COLOURS[0],
    cardColourHover: CARD_HOVER_COLOURS[0],
    groupColour: GROUP_COLOURS[0],
    groupFontColour: GROUP_FONT_COLOURS[0],
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
    cardColour: CARD_COLOURS[1],
    cardColourHover: CARD_HOVER_COLOURS[1],
    groupColour: GROUP_COLOURS[1],
    groupFontColour: GROUP_FONT_COLOURS[1],
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
    cardColour: CARD_COLOURS[2],
    cardColourHover: CARD_HOVER_COLOURS[2],
    groupColour: GROUP_COLOURS[2],
    groupFontColour: GROUP_FONT_COLOURS[2],
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
];

export const WHAT_WENT_WELL_COLUMN = 0;
export const WHAT_DIDNT_GO_WELL = 1;
export const ACTIONS_COLUMN = 2;

export const UserTypeArray = [
  { id: 1, type: 'Facilitator' },
  { id: 2, type: 'Participant' },
];
