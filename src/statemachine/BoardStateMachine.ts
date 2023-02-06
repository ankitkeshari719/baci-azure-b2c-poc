import {
  BoardState,
  Card,
  CardGroup,
  Column,
  FeedbackEntry,
  PulseCheckEntry,
} from '../types';

import { UNGROUPED } from '../constants';
// import { GlobalContext } from '../contexts/GlobalContext';
import React from 'react';

export enum BoardActionType {
  RESET_RETRO = 'resetRetro',
  LOAD_STATE = 'loadState',
  //   SET_LOADING = 'setLoading',
  UPDATE_RETRO_DETAILS = 'updateRetroDetails',
  CREATE_GROUP = 'createGroup',
  ADD_NEW_CARD = 'addNewCard',
  DELETE_CARD = 'deleteCard',
  MOVE_CARD = 'moveCard',
  MERGE_CARDS = 'mergeCards',
  REORDER_CARD = 'reorderCard',
  ADD_REACT_TO_CARD = 'addReactToCard',
  ADD_REACT_TO_GROUP = 'addReactToGroup',
  REMOVE_REACT_FROM_CARD = 'removeReactFromCard',
  LOCK_CARD = 'lockCard',
  SET_CARD_VALUE = 'setCardValue',
  LOCK_GROUP = 'lockGroup',
  SET_GROUP_NAME = 'setGroupName',
  DELETE_GROUP = 'deleteGroup',
  JOIN_RETRO = 'joinRetro',
  START_TIMER = 'startTimer',
  STOP_TIMER = 'stopTimer',
  PAUSE_TIMER = 'pauseTimer',
  RESUME_TIMER = 'resumeTimer',
  INCREMENT_TIMER = 'incrementTimer',
  DECREMENT_TIMER = 'decrementTimer',
  SET_TIMER = 'setTimer',
  EXPIRE_TIMER = 'expireTimer',
  SET_COLUMN_NAME = 'setColumnName',
  SUBMIT_PULSE_CHECK = 'submitPulseCheck',
  SUBMIT_FEEDBACK = 'submitFeedback',
  END_RETRO = 'endRetro',
  START_RETRO = 'startRetro',
  PUBLISH_COLUMN = 'publishColumn',
  LOCK_COLUMN = 'lockColumn',
  SET_FACILITATOR = 'setFacilitator',
}

export const BOARD_STATE_MACHINE_VERSION = 1;

export const validateAction = (
  state: BoardState,
  actionName: BoardActionType,
  parameters: any,
  userId: string,
  date?: Date,
  version?: number
): boolean => {
  const {
    columns,
    users,
    countdownDuration,
    countdownPaused,
    countdownFrom,
    countdownExpired,
  } = state;

  const findCardInGroup = (group: CardGroup, id: string) =>
    group.cards.find(card => card.id === id);

  const findUser = (userId: string) =>
    users.find(user => user.userId === userId);

  const findColumn = (columnId: string) =>
    columns.find(column => column.id === columnId);

  const findCard = (
    id: string
  ): {
    column?: Column;
    columnIndex?: number;
    group?: CardGroup;
    card?: Card;
    index?: number;
  } => {
    for (const column of columns) {
      for (const group of column.groups) {
        const card = findCardInGroup(group, id);
        if (card) {
          return {
            column,
            columnIndex: columns.indexOf(column),
            group,
            card,
            index: group.cards.indexOf(card),
          };
        }
      }
    }
    return {};
  };

  const findGroup = (
    id: string
  ): {
    group?: CardGroup;
    column?: Column;
    columnIndex?: number;
    index?: number;
  } => {
    for (const column of columns) {
      const group = column.groups.find(group => group.id === id);
      if (group) {
        return {
          group,
          column,
          columnIndex: columns.indexOf(column),
          index: column.groups.indexOf(group),
        };
      }
    }
    return {};
  };

  const isFacilitator = (id: string): boolean => {
    if (state.creatorId === id) {
      return true;
    }
    return false;
  };

  const isUpdateRetroDetailsValid = (
    retroName?: string,
    retroGoal?: string,
    retroTimeframe?: string,
    fullPulseCheck?: boolean,
    creatorId?: string,
    userId?: string,
    avatar?: string,
    retroStatus?: string,
    pulseCheck?: any,
    template?: any
  ) => {
    // if (
    //   creatorId != '' &&
    //   creatorId !== undefined &&
    //   userId != '' &&
    //   userId !== undefined
    // )
    //   return true;
    // else return false;
    return true;
  };

  const isCreateGroupValid = (
    columnId: string,
    groupId: string,
    _order: number,
    userId: string
  ): boolean => {
    const columnIndex = columns.findIndex(column => column.id === columnId);
    if (columnIndex !== -1 && !findGroup(groupId).group) {
      return true;
    }
    return false;
  };

  const isAddNewCardValid = (
    groupId: string,
    id: string,
    value: string,
    userId: string
  ): boolean => {
    if (!findCard(id).card) {
      const group = findGroup(groupId);
      if (group) {
        return true;
      }
    }
    return false;
  };

  const isMoveCardValid = (
    cardId: string,
    toGroup: string,
    toIndex: number,
    userId: string
  ): boolean => {
    const { card, group, index } = findCard(cardId);
    if (
      card &&
      !(card.locked && card.lockedBy !== userId) &&
      group &&
      !(group.id === toGroup && index === toIndex)
    ) {
      const targetGroup = findGroup(toGroup);
      if (targetGroup) {
        return true;
      }
    }
    return false;
  };

  const isMergeCardsValid = (
    groupId: string,
    order: number,
    cardId1: string,
    cardId2: string,
    userId: string
  ): boolean => {
    const { column, card: card1, group: group1 } = findCard(cardId1);
    const { card: card2, group: group2 } = findCard(cardId2);
    const { group: targetGroup } = findGroup(groupId);
    if (
      column &&
      group1 &&
      group1 === group2 &&
      group1?.name !== UNGROUPED &&
      group1?.cards.length === 2
    ) {
      // Don't merge cards that are in the same group and only have 2 cards
      return false;
    }
    if (
      column &&
      card1 &&
      card2 &&
      !(card1.locked && card1.lockedBy !== userId) &&
      !(card2.locked && card2.lockedBy !== userId) &&
      group1 &&
      group2 &&
      !targetGroup
    ) {
      return true;
    }
    return false;
  };

  const isAddReactToCardValid = (
    cardId: string,
    react: string,
    userId: string
  ): boolean => {
    const { card } = findCard(cardId);
    if (card && !card.reacts.find(r => r.emoji === react && r.by === userId)) {
      return true;
    }
    return false;
  };

  const isAddReactToGroupValid = (
    react: string,
    groupId: string,
    userId: string
  ): boolean => {
    const { group } = findGroup(groupId);
    if (group && userId) {
      return true;
    }
    return false;
  };

  const isDeleteCardValid = (cardId: string, userId: string): boolean => {
    const { card } = findCard(cardId);
    if (card && !(card.locked && card.lockedBy !== userId)) {
      return true;
    }
    return false;
  };
  const isPublishColumnValid = (
    columnId: any,
    value: any,
    userId: string
  ): boolean => {
    return true;
  };

  const isRemoveReactFromCardValid = (
    cardId: string,
    react: string,
    userId: string
  ): boolean => {
    const { card } = findCard(cardId);
    if (card && card.reacts.find(r => r.emoji === react && r.by === userId)) {
      return true;
    }
    return false;
  };

  const isLockCardValid = (
    cardId: string,
    lock: boolean,
    userId: string
  ): boolean => {
    const { card } = findCard(cardId);
    if (
      card &&
      lock !== card.locked &&
      (!card.lockedBy || card.lockedBy === userId)
    ) {
      return true;
    }
    return false;
  };

  const isSetCardValueValid = (
    cardId: string,
    value: string,
    userId: string
  ): boolean => {
    const { card } = findCard(cardId);
    if (card && !(card.locked && card.lockedBy !== userId)) {
      return true;
    }
    return false;
  };

  const isLockGroupValid = (
    groupId: string,
    lock: boolean,
    userId: string
  ): boolean => {
    const { group } = findGroup(groupId);
    if (
      group &&
      lock !== group.locked &&
      (!group.lockedBy || group.lockedBy === userId)
    ) {
      return true;
    }
    return false;
  };

  const isSetGroupNameValid = (
    groupId: string,
    name: string,
    userId: string
  ): boolean => {
    const { group } = findGroup(groupId);
    if (group && !(group.locked && group.lockedBy !== userId)) {
      return true;
    }
    return false;
  };

  const isDeleteGroupValid = (groupId: string, userId: string): boolean => {
    const { column, group, index } = findGroup(groupId);
    if (
      column &&
      group &&
      index !== undefined &&
      !(group.locked && group.lockedBy !== userId)
    ) {
      const groupUngrouped = column?.groups.find(g => g.name === UNGROUPED);
      if (groupUngrouped) {
        return true;
      }
    }
    return false;
  };

  const canJoinRetro = (userNickname: string, userId: string): boolean => {
    const user = findUser(userId);
    return !user || user.userNickname !== userNickname;
  };

  const canStartTimer = (
    startTime: number,
    duration: number,
    userId: string
  ): boolean => {
    if (countdownFrom === -1) {
      return true;
    }
    return true;
  };

  const canStopTimer = (userId: string): boolean => {
    if (
      countdownFrom !== -1 ||
      countdownPaused === true ||
      countdownExpired === true
    ) {
      return true;
    }
    return true;
  };

  const canPauseTimer = (remaining: number, userId: string): boolean => {
    if (!countdownPaused) {
      return true;
    }
    return false;
  };

  const canResumeTimer = (from: number, userId: string): boolean => {
    if (countdownPaused) {
      return true;
    }
    return false;
  };

  const canIncrementTimer = (
    fromDuration: number,
    amount: number,
    userId: string
  ): boolean => {
    return fromDuration === countdownDuration;
  };

  const canDecrementTimer = (
    fromDuration: number,
    amount: number,
    userId: string
  ): boolean => {
    return fromDuration === countdownDuration && countdownDuration > amount;
  };

  const canExpireTimer = (userId: string): boolean => {
    if (!state.countdownExpired) {
      return true;
    }
    return false;
  };

  const canSetColumnName = (columnId: string, name: string, userId: string) => {
    const column = findColumn(columnId);
    return !!column;
  };

  const canSubmitPulseCheck = (
    questions: PulseCheckEntry[],
    userId: string
  ) => {
    // Can submit pulse check only once
    const user = findUser(userId);
    if (!user || user.pulseCheckQuestions?.length !== 0) return false;
    return true;
  };

  const canSubmitFeedback = (feedback: FeedbackEntry[], userId: string) => {
    // Can submit feedback only once
    const user = findUser(userId);
    if (!user || user.feedback?.length !== 0) return false;
    return true;
  };

  const canEndRetro = (undo: boolean, userId: string) => {
    const user = findUser(userId);

    return user?.isFacilitator
      ? state.ended !== !undo
      : userId === state.creatorId && state.ended !== !undo;
    //   (userId === state.creatorId || user?.isFacilitator) &&
    // state.ended !== !undo;
  };

  switch (actionName) {
    case BoardActionType.UPDATE_RETRO_DETAILS:
      return isUpdateRetroDetailsValid(
        parameters.retroName,
        parameters.retroGoal,
        parameters.retroTimeframe,
        parameters.fullPulseCheck,
        userId,
        parameters.avatar,
        parameters.retroStatus,
        parameters.pulseCheck,
        parameters.template
      );
    case BoardActionType.CREATE_GROUP:
      return isCreateGroupValid(
        parameters.columnId,
        parameters.groupId,
        parameters.order,
        userId
      );
    case BoardActionType.ADD_NEW_CARD:
      return isAddNewCardValid(
        parameters.groupId,
        parameters.id,
        parameters.value,
        userId
      );
    case BoardActionType.START_RETRO:
      return true;

    case BoardActionType.DELETE_CARD:
      return isDeleteCardValid(parameters.cardId, userId);
    case BoardActionType.MOVE_CARD:
      return isMoveCardValid(
        parameters.cardId,
        parameters.groupId,
        parameters.index,
        userId
      );
    case BoardActionType.MERGE_CARDS:
      return isMergeCardsValid(
        parameters.groupId,
        parameters.order,
        parameters.cardId1,
        parameters.cardId2,
        userId
      );
    case BoardActionType.REORDER_CARD:
      return true;
    case BoardActionType.ADD_REACT_TO_CARD:
      return isAddReactToCardValid(parameters.cardId, parameters.react, userId);
    case BoardActionType.REMOVE_REACT_FROM_CARD:
      return isRemoveReactFromCardValid(
        parameters.cardId,
        parameters.react,
        userId
      );
    case BoardActionType.ADD_REACT_TO_GROUP:
      return isAddReactToGroupValid(
        parameters.react,
        parameters.groupId,
        userId
      );
    case BoardActionType.LOCK_CARD:
      return isLockCardValid(parameters.cardId, parameters.lock, userId);
    case BoardActionType.SET_CARD_VALUE:
      return isSetCardValueValid(parameters.cardId, parameters.value, userId);
    case BoardActionType.LOCK_GROUP:
      return isLockGroupValid(parameters.groupId, parameters.lock, userId);
    case BoardActionType.SET_GROUP_NAME:
      return isSetGroupNameValid(parameters.groupId, parameters.name, userId);
    case BoardActionType.DELETE_GROUP:
      return isDeleteGroupValid(parameters.groupId, userId);
    case BoardActionType.JOIN_RETRO:
      return canJoinRetro(parameters.userNickname, userId);
    case BoardActionType.START_TIMER:
      return canStartTimer(parameters.startTime, parameters.duration, userId);
    case BoardActionType.STOP_TIMER:
      return canStopTimer(userId);
    case BoardActionType.PAUSE_TIMER:
      return canPauseTimer(parameters.remaining, userId);
    case BoardActionType.RESUME_TIMER:
      return canResumeTimer(parameters.from, userId);
    case BoardActionType.INCREMENT_TIMER:
      return canIncrementTimer(
        parameters.fromDuration,
        parameters.amount,
        userId
      );
    case BoardActionType.DECREMENT_TIMER:
      return canDecrementTimer(
        parameters.fromDuration,
        parameters.amount,
        userId
      );
    case BoardActionType.SET_TIMER:
      return true;
    case BoardActionType.EXPIRE_TIMER:
      return canExpireTimer(userId);
    case BoardActionType.SET_COLUMN_NAME:
      return canSetColumnName(parameters.columnId, parameters.value, userId);
    case BoardActionType.PUBLISH_COLUMN:
      return isPublishColumnValid(
        parameters.columnId,
        parameters.value,
        userId
      );
    case BoardActionType.SUBMIT_PULSE_CHECK:
      return canSubmitPulseCheck(parameters.questions, userId);
    case BoardActionType.SUBMIT_FEEDBACK:
      return canSubmitFeedback(parameters.feedback, userId);
    case BoardActionType.END_RETRO:
      return canEndRetro(parameters.undo, userId);
    case BoardActionType.SET_FACILITATOR:
      return true;
    // case BoardActionType.SET_LOADING:
    //   return true;
    default:
      return false;
  }
};

export const processAction = (
  state: BoardState,
  actionName: BoardActionType,
  parameters: any,
  userId: string,
  date?: Date,
  version?: number,
  avatar?: string
): void => {
  const {
    columns,
    users,
    countdownDuration,
    countdownPaused,
    countdownFrom,
    countdownExpired,
  } = state;

  const findCardInGroup = (group: CardGroup, id: string) =>
    group.cards.find(card => card.id === id);

  const findUser = (userId: string) =>
    users.find(user => user.userId === userId);

  const findColumn = (columnId: string) =>
    columns.find(column => column.id === columnId);

  const findCard = (
    id: string
  ): {
    column?: Column;
    columnIndex?: number;
    group?: CardGroup;
    card?: Card;
    index?: number;
  } => {
    if (columns) {
      for (const column of columns) {
        for (const group of column.groups) {
          const card = findCardInGroup(group, id);
          if (card) {
            return {
              column,
              columnIndex: columns.indexOf(column),
              group,
              card,
              index: group.cards.indexOf(card),
            };
          }
        }
      }
    }
    return {};
  };
  const findGroup = (
    id: string
  ): {
    group?: CardGroup;
    column?: Column;
    columnIndex?: number;
    index?: number;
  } => {
    for (const column of columns) {
      const group = column.groups.find(group => group.id === id);
      if (group) {
        return {
          group,
          column,
          columnIndex: columns.indexOf(column),
          index: column.groups.indexOf(group),
        };
      }
    }
    return {};
  };

  const updateRetroDetails = (
    retroName?: string,
    retroGoal?: string,
    retroTimeframe?: string,
    fullPulseCheck?: boolean,
    creatorId?: string,
    userId?: string,
    avatar?: string,
    retroStatus?: string,
    pulseCheck?: any,
    template?: any
  ) => {
    if (retroName !== undefined && retroName !== '') {
      state.retroName = retroName;
    }
    if (retroGoal !== undefined) {
      state.retroGoal = retroGoal;
    }
    if (retroTimeframe !== undefined) {
      state.retroTimeframe = retroTimeframe;
    }
    if (fullPulseCheck !== undefined) {
      state.fullPulseCheck = fullPulseCheck;
    }
    if (creatorId != '' && creatorId != undefined) {
      state.creatorId = creatorId;
    }
    if (avatar != undefined && avatar != '') {
      state.avatar = avatar;
    }
    if (retroStatus != undefined) {
      state.retroStatus = retroStatus;
    }
    if (pulseCheck != undefined && pulseCheck != null) {
      state.pulseCheck = pulseCheck;
    }
    if (template != undefined && pulseCheck != null) {
      state.template = template;
    }
    state.lastUpdatedBy = userId;
  };

  const createGroup = (
    columnId: string,
    groupId: string,
    order: number,
    userId: string
  ) => {
    const columnIndex = columns.findIndex(column => column.id === columnId);
    if (columnIndex !== -1 && !findGroup(groupId).group) {
      const column = columns[columnIndex];
      column.groups.unshift({
        id: groupId,
        name: '', //'Group ' + column.groups.length,
        cards: [],
        order,
        reactions: [],
        createdBy: userId,
        locked: false,
        lastUpdatedBy: userId,
      });
    }
  };

  const addNewCard = (
    groupId: string,
    id: string,
    value: string,
    userId: string,
    avatar: string
  ) => {
    if (!findCard(id).card) {
      const { group } = findGroup(groupId);
      if (group) {
        group.cards.push({
          id,
          value,
          reacts: [],
          locked: false,
          lockedBy: undefined,
          createdBy: userId,
          lastUpdatedBy: userId,
          editCount: 0,
          avatar: avatar,
        });
      }
    }
  };

  const moveCard = (
    cardId: string,
    toGroup: string,
    toIndex: number,
    userId: string
  ) => {
    const { card, group, index } = findCard(cardId);
    if (
      card &&
      !(card.locked && card.lockedBy !== userId) &&
      group &&
      !(group.id === toGroup && index === toIndex)
    ) {
      const { group: targetGroup } = findGroup(toGroup);
      if (targetGroup) {
        const cardsList = targetGroup.cards;
        group.cards.splice(index as number, 1);
        cardsList.splice(
          toIndex -
            (group.id === targetGroup.id && (index as number) < toIndex
              ? 1
              : 0),
          0,
          card
        );
        card.lastUpdatedBy = userId;
      }
    }
  };

  const reorderCards = (
    cardId: string,
    targetCard: string,
    order: number,
    moveToLast: boolean,
    userId: string
  ) => {
    const { column, card, group, index: index1 } = findCard(cardId);
    const { index: index2 } = findCard(targetCard);
    if (column && card && group && index1 != undefined && index2 != undefined) {
      if (index1 < index2) {
        group.cards.splice(index1, 1);
        if (moveToLast) {
          group.cards.splice(index2, 0, card);
        } else {
          group.cards.splice(index2 - 1, 0, card);
        }
      } else {
        group.cards.splice(index1, 1);
        group.cards.splice(index2, 0, card);
      }
    }
  };

  const mergeCards = (
    groupId: string,
    order: number,
    cardId1: string,
    cardId2: string,
    userId: string
  ) => {
    const { column, card: card1, group: group1 } = findCard(cardId1);
    const { card: card2, group: group2 } = findCard(cardId2);
    const { group: targetGroup } = findGroup(groupId);
    if (
      column &&
      group1 &&
      group1 === group2 &&
      group1?.name !== UNGROUPED &&
      group1?.cards.length === 2
    ) {
      // Don't merge cards that are in the same group and only have 2 cards
      return;
    }
    if (
      column &&
      card1 &&
      card2 &&
      !(card1.locked && card1.lockedBy !== userId) &&
      !(card2.locked && card2.lockedBy !== userId) &&
      group1 &&
      group2 &&
      !targetGroup
    ) {
      // If both cards are ungrouped, create a new group
      if (group1.name === UNGROUPED && group2.name === UNGROUPED) {
        const newGroup = {
          id: groupId,
          name: '', //'Group ' + column.groups.length,
          cards: [card1, card2],
          order,
          reactions: [],
          createdBy: userId,
          locked: false,
        };
        group1.cards.splice(group1.cards.indexOf(card1), 1);
        group2.cards.splice(group2.cards.indexOf(card2), 1);

        column.groups = [
          ...column.groups.filter(group => group.name !== UNGROUPED),
          newGroup,
          ...column.groups.filter(group => group.name === UNGROUPED),
        ];
      } else {
        // Else merge cards into target group
        group1.cards.splice(group1.cards.indexOf(card1), 1);
        group2.cards.push(card1);
      }
      card1.lastUpdatedBy = userId;
      card2.lastUpdatedBy = userId;
    }
  };

  const addReactToCard = (cardId: string, react: string, userId: string) => {
    const { card } = findCard(cardId);
    if (card && !card.reacts.find(r => r.emoji === react && r.by === userId)) {
      card.reacts.push({
        emoji: react,
        by: userId,
      });
      card.lastUpdatedBy = userId;
    }
  };

  const addReactToGroup = (react: string, groupId: string, userId: string) => {
    const { group } = findGroup(groupId);
    if (group && userId) {
      if (!group.reactions) {
        group.reactions = [];
      }
      const existing = group.reactions.findIndex(
        ({ userId: u }) => userId === u
      );
      if (existing !== -1) {
        group.reactions.splice(existing, 1);
      }
      if (react !== '') {
        group.reactions.push({ userId, react });
      }
      group.lastUpdatedBy = userId;
    }
  };

  const deleteCard = (cardId: string, userId: string) => {
    const { group, card, index } = findCard(cardId);
    if (group && card && !(card.locked && card.lockedBy !== userId)) {
      group.cards.splice(index as number, 1);
    }
  };

  const removeReactFromCard = (
    cardId: string,
    react: string,
    userId: string
  ) => {
    const { card } = findCard(cardId);
    if (card && card.reacts.find(r => r.emoji === react && r.by === userId)) {
      const index = card.reacts.findIndex(
        r => r.emoji === react && r.by === userId
      );
      card.reacts.splice(index, 1);
      card.lastUpdatedBy = userId;
    }
  };

  const lockCard = (cardId: string, lock: boolean, userId: string) => {
    const { card } = findCard(cardId);
    if (
      card &&
      lock !== card.locked &&
      (!card.lockedBy || card.lockedBy === userId)
    ) {
      card.locked = lock;
      card.lockedBy = lock ? userId : undefined;
    }
  };

  const setCardValue = (cardId: string, value: string, userId: string) => {
    const { card } = findCard(cardId);
    if (card && !(card.locked && card.lockedBy !== userId)) {
      card.value = value;
      card.lastUpdatedBy = userId;
      card.editCount++;
    }
  };

  const lockGroup = (groupId: string, lock: boolean, userId: string) => {
    const { group } = findGroup(groupId);
    if (
      group &&
      lock !== group.locked &&
      (!group.lockedBy || group.lockedBy === userId)
    ) {
      group.locked = lock;
      group.lockedBy = lock ? userId : undefined;
    }
  };

  const setGroupName = (groupId: string, name: string, userId: string) => {
    const { group } = findGroup(groupId);
    if (group && !(group.locked && group.lockedBy !== userId)) {
      group.name = name;
      group.lastUpdatedBy = userId;
    }
  };

  const deleteGroup = (groupId: string, userId: string) => {
    const { column, group, index } = findGroup(groupId);
    if (
      column &&
      group &&
      index !== undefined &&
      !(group.locked && group.lockedBy !== userId)
    ) {
      const groupUngrouped = column?.groups.find(g => g.name === UNGROUPED);
      if (groupUngrouped) {
        groupUngrouped.cards = [...groupUngrouped.cards, ...group.cards];
        column.groups.splice(index, 1);
      }
    }
  };

  const joinRetro = (
    userNickname: string,
    date: Date | undefined,
    avatar: string,
    userId: string,
    isMobile: boolean
  ) => {
    const user = findUser(userId);
    if (!user) {
      if (date && !state.startedDate) {
        state.startedDate = new Date(date);
      }
      state.users.push({
        userId,
        userNickname,
        avatar,
        feedback: [],
        pulseCheckQuestions: [],
        checked: true,
        isFacilitator: false,
        isMobile: isMobile,
      });
    } else if (user?.userNickname !== userNickname) {
      user.userNickname = userNickname;
    }
  };

  const startTimer = (startTime: number, duration: number, userId: string) => {
    if (countdownFrom === -1) {
      state.countdownFrom = startTime;
      state.countdownPaused = false;
      state.countdownExpired = false;
    }
  };

  const stopTimer = (userId: string) => {
    if (
      countdownFrom !== -1 ||
      countdownPaused === true ||
      countdownExpired === true
    ) {
      state.countdownFrom = -1;
      state.countdownDuration = 5 * 60 * 1000;
      state.countdownPaused = false;
      state.countdownExpired = false;
    }
  };

  const pauseTimer = (remaining: number, userId: string) => {
    if (!countdownPaused) {
      state.countdownFrom = -1;
      state.countdownPaused = true;
      state.countdownDuration = remaining;
    }
  };

  const resumeTimer = (from: number, userId: string) => {
    if (countdownPaused) {
      state.countdownPaused = false;
      state.countdownFrom = from;
    }
  };

  const incrementTimer = (
    fromDuration: number,
    amount: number,
    userId: string
  ) => {
    if (countdownDuration === fromDuration) {
      state.countdownDuration = countdownDuration + amount;
    }
  };

  const decrementTimer = (
    fromDuration: number,
    amount: number,
    userId: string
  ) => {
    if (countdownDuration === fromDuration && countdownDuration > amount) {
      state.countdownDuration = countdownDuration - amount;
    }
  };

  const setTimer = (fromDuration: number, amount: number, userId: string) => {
    state.countdownDuration = amount;
  };

  const expireTimer = (userId: string) => {
    if (!state.countdownExpired) {
      state.countdownExpired = true;
    }
  };

  const setColumnName = (columnId: string, name: string, userId: string) => {
    const column = findColumn(columnId);
    if (column) {
      column.name = name;
      column.lastUpdatedBy = userId;
    }
  };

  const submitPulseCheck = (questions: PulseCheckEntry[], userId: string) => {
    const user = findUser(userId);
    if (user) {
      user.pulseCheckQuestions = questions;
    }
  };

  const submitFeedback = (feedback: FeedbackEntry[], userId: string) => {
    const user = findUser(userId);
    if (user) {
      user.feedback = feedback;
    }
  };

  const endRetro = (undo: boolean, date: Date | undefined, userId: string) => {
    state.ended = !undo;
    if (state.ended && date && state.endedDate === undefined) {
      state.endedDate = date;
    }
    if (!state.ended && state.endedDate !== undefined) {
      state.endedDate = undefined;
    }
  };

  const startRetro = (
    retroDuration: number,
    userId: string,
    creator: string
  ) => {
    if (userId === creator) {
      state.retroDuration = retroDuration;
      state.retroStarted = true;
      state.startedTimeStamp = Date.now();
    }
  };

  const publishRetro = (columnId: string, value: boolean, userId: string) => {
    const column = findColumn(columnId);
    if (column) {
      column.publish = value;
    }
  };

  const setFacilitator = (userId: string) => {
    state.users.forEach(user => {
      if (user.userId == userId) {
        user.isFacilitator = !user.isFacilitator;
      }
    });
    // state.users
  };

  let noMatch = false;

  switch (actionName) {
    case BoardActionType.UPDATE_RETRO_DETAILS:
      updateRetroDetails(
        parameters.retroName,
        parameters.retroGoal,
        parameters.retroTimeframe,
        parameters.fullPulseCheck,
        parameters.creatorId,
        userId,
        avatar,
        parameters.retroStatus,
        parameters.pulseCheck,
        parameters.template
      );
      break;
    case BoardActionType.CREATE_GROUP:
      createGroup(
        parameters.columnId,
        parameters.groupId,
        parameters.order,
        userId
      );
      break;
    case BoardActionType.ADD_NEW_CARD:
      addNewCard(
        parameters.groupId,
        parameters.id,
        parameters.value,
        userId,
        parameters.avatar
      );
      break;
    case BoardActionType.DELETE_CARD:
      deleteCard(parameters.cardId, userId);
      break;
    case BoardActionType.MOVE_CARD:
      moveCard(parameters.cardId, parameters.groupId, parameters.index, userId);
      break;
    case BoardActionType.MERGE_CARDS:
      mergeCards(
        parameters.groupId,
        parameters.order,
        parameters.cardId1,
        parameters.cardId2,
        userId
      );
      break;
    case BoardActionType.REORDER_CARD:
      reorderCards(
        parameters.cardId,
        parameters.targetCard,
        parameters.index,
        parameters.moveToLast,
        userId
      );
      break;
    case BoardActionType.ADD_REACT_TO_CARD:
      addReactToCard(parameters.cardId, parameters.react, userId);
      break;
    case BoardActionType.ADD_REACT_TO_GROUP:
      addReactToGroup(parameters.react, parameters.groupId, userId);
      break;
    case BoardActionType.REMOVE_REACT_FROM_CARD:
      removeReactFromCard(parameters.cardId, parameters.react, userId);
      break;
    case BoardActionType.LOCK_CARD:
      lockCard(parameters.cardId, parameters.lock, userId);
      break;
    case BoardActionType.SET_CARD_VALUE:
      setCardValue(parameters.cardId, parameters.value, userId);
      break;
    case BoardActionType.LOCK_GROUP:
      lockGroup(parameters.groupId, parameters.lock, userId);
      break;
    case BoardActionType.SET_GROUP_NAME:
      setGroupName(parameters.groupId, parameters.name, userId);
      break;
    case BoardActionType.DELETE_GROUP:
      deleteGroup(parameters.groupId, userId);
      break;
    case BoardActionType.JOIN_RETRO:
      joinRetro(
        parameters.userNickname,
        date,
        parameters.avatar,
        userId,
        parameters.isMobile
      );
      break;
    case BoardActionType.START_TIMER:
      startTimer(parameters.startTime, parameters.duration, userId);
      break;
    case BoardActionType.STOP_TIMER:
      stopTimer(userId);
      break;
    case BoardActionType.PAUSE_TIMER:
      pauseTimer(parameters.remaining, userId);
      break;
    case BoardActionType.RESUME_TIMER:
      resumeTimer(parameters.from, userId);
      break;
    case BoardActionType.INCREMENT_TIMER:
      incrementTimer(parameters.fromDuration, parameters.amount, userId);
      break;
    case BoardActionType.DECREMENT_TIMER:
      decrementTimer(parameters.fromDuration, parameters.amount, userId);
      break;
    case BoardActionType.SET_TIMER:
      setTimer(parameters.fromDuration, parameters.amount, userId);
      break;
    case BoardActionType.EXPIRE_TIMER:
      expireTimer(userId);
      break;
    case BoardActionType.SET_COLUMN_NAME:
      setColumnName(parameters.columnId, parameters.value, userId);
      break;
    case BoardActionType.PUBLISH_COLUMN:
      publishRetro(parameters.columnId, parameters.value, userId);
      break;
    case BoardActionType.SUBMIT_PULSE_CHECK:
      submitPulseCheck(parameters.questions, userId);
      break;
    case BoardActionType.SUBMIT_FEEDBACK:
      submitFeedback(parameters.feedback, userId);
      break;
    case BoardActionType.END_RETRO:
      endRetro(parameters.undo, date, userId);
      break;
    case BoardActionType.START_RETRO:
      startRetro(parameters.retroDuration, userId, parameters.creatorId);
      break;
    case BoardActionType.SET_FACILITATOR:
      setFacilitator(parameters.userIdFac);
      break;
    default:
      noMatch = true;
      break;
  }

  if (!noMatch) {
    state.lastStateUpdate = new Date();
  }
};
