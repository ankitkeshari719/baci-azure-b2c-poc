import { AlertColor } from '@mui/material';

export class Retro {
  id: string = '';
  humanId: string = '';
  name: string = '';
  joinUrl: string = '';
  creatorId?: string = '';
  timestamp?: Date | undefined;
  waitingTimeStamp: Date | undefined;
  retroStatus: string = '';
}
export interface PulseCheckSubmitStatus {
  retroId: string;
  pulseSubmitState: boolean;
}
export class User {
  id: string = '';
  name: string = '';
  nickname?: string = '';
  avatar: string = '';
  userType: number = 0;
}

export class SnackMessageClass {
  snackMessageType: AlertColor = 'success';
  message: string = '';
}

export class Global {
  user: User = new User();
  currentRetro?: Retro = undefined;
  preferredNickname?: string = undefined;
  avatar?: string = '';
  snackMessage: SnackMessageClass = new SnackMessageClass();
  retroCreateState?: boolean = false;
  pulseCheckState?: PulseCheckSubmitStatus = {
    retroId: '',
    pulseSubmitState: false,
  };

  loadingFlag?: boolean = false;
  expandColumn?: number = -1;
  usersSelected?: any[] = [];
  leaveRetro?: boolean = false;
  feedbackSubmit?: boolean = false;
  emojiId?: string = '';
}

export interface Card {
  id: string;
  value: string;
  reacts: any[];
  locked: boolean;
  lockedBy?: string;
  createdBy?: string;
  lastUpdatedBy?: string;
  editCount: number;
  avatar: string;
}

export interface CardGroup {
  id: string;
  name: string;
  order: number;
  reactions?: { userId: string; react: string }[];
  cards: Card[];
  createdBy: string;
  lastUpdatedBy?: string;
  locked: boolean;
  lockedBy?: string;
}

export interface Column {
  id: string;
  name: string;
  order: number;
  cardColour: string;
  cardColourHover: string;
  groupFontColour: string;
  groupColour: string;
  groups: CardGroup[];
  lastUpdatedBy?: string;
  publish: boolean;
}

export interface PulseCheckEntry {
  id: string;
  entry: number;
}

export interface PulseCheckSubmitStatus {
  retroId: string;
  pulseSubmitState: boolean;
}

export interface FeedbackEntry {
  id: string;
  entry: string;
}

export class BoardState {
  retroId: string = '';
  // publishColumn: any[] = [];
  loading: boolean = true;
  columns: Column[] = [];
  creatorId: string = '';
  users: {
    userId: string;
    userNickname: string;
    avatar: string;
    feedback: FeedbackEntry[];
    pulseCheckQuestions: PulseCheckEntry[];
    checked: boolean;
    isFacilitator: boolean;
    isMobile: boolean;
  }[] = [];
  countdownFrom: number = -1;
  countdownDuration: number = 5 * 60 * 1000;
  countdownPaused: boolean = false;
  countdownExpired: boolean = false;
  retroName: string = '';
  retroGoal: string = '';
  retroTimeframe: string = '';
  fullPulseCheck: boolean = false;
  lastUpdatedBy?: string;
  ended: boolean = false;
  retroStatus?: string;
  retroStarted: boolean = false;
  loadingFlag: boolean = false;
  retroDuration: number = 0;
  needsToShow: boolean = false;
  startedDate: Date | undefined;
  startedTimeStamp: number | undefined;
  endedDate: Date | undefined;
  lastStateUpdate: Date | undefined;
  avatar: string | undefined;
  pulseCheck?: any;
  template?: any

  constructor(retroId: string, columns: Column[]) {
    this.retroId = retroId;
    this.columns = columns;
  }
}

export interface Action {
  id: string;
  actionName: string;
  parameters: any;
  userId: string;
  timestamp: number;
  date?: Date;
  sourceActionTimestamp: number;
  sourceActionId: string;
  onlyVisibleBy?: string[];
  version: number;
}
