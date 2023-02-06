import { ActionType, GlobalContext } from '../contexts/GlobalContext';
//import { createRetro,getRetro,addRetroAction,getRetroByHumanId } from "../firebase/firestore";
import {
  createRetro,
  getRetro,
  addRetroAction,
  getRetroByHumanId,
} from '../msal/services';
import { Action, Retro } from '../types';

import React from 'react';
import shortid from 'shortid';
import {
  BoardActionType,
  BOARD_STATE_MACHINE_VERSION,
} from '../statemachine/BoardStateMachine';
import { pulseCheckInterface } from '../screens/CreateRetro/const';

export const useRetro = () => {
  const [state, dispatch] = React.useContext(GlobalContext);

  return {
    create: async (
      retro: Partial<Omit<Retro, 'id'>>,
      retroTimeframe: string,
      retroGoal: string
    ): Promise<Retro> => {
      const humanId = (
        '' +
        (Math.random() * 1000000000 + 1000000000)
      ).substring(0, 6);

      const currentRetro = {
        name: 'Retro',
        ...(retro ? retro : {}),
        humanId,
        joinUrl: `${window.location.protocol}//${window.location.hostname}${
          window.location.port ? ':' + window.location.port : ''
        }/join/${humanId}`,
      } as Retro;

      const id = await createRetro(currentRetro, state.user);
      const retrievedRetro = await getRetro(id);

      dispatch({
        type: ActionType.SET_CURRENT_RETRO,
        payload: { retro: retrievedRetro },
      });

      const action: Action = {
        id: shortid.generate(),
        actionName: BoardActionType.UPDATE_RETRO_DETAILS,
        parameters: {
          retroName: retro?.name,
          retroTimeframe,
          retroGoal,
          creatorId: state.currentRetro?.creatorId,
          userId: state.user.id,
        },
        userId: state.user.id,
        timestamp: 0,
        sourceActionId: '',
        sourceActionTimestamp: 0,
        version: BOARD_STATE_MACHINE_VERSION,
      };

      await addRetroAction(id, action);

      return retrievedRetro;
    },

    createTemplate: async (
      retro: Partial<Omit<Retro, 'id'>>,
      retroTimeframe: string,
      retroGoal: string,
      userName: string,
      selectedAvatar: string,
      userType: number,
      selectedPulseCheck: pulseCheckInterface | null,
      selectedTemplate: any,
    ): Promise<Retro> => {
      const humanId = (
        '' +
        (Math.random() * 1000000000 + 1000000000)
      ).substring(0, 6);

      const currentRetro = {
        name: 'Retro',
        ...(retro ? retro : {}),
        humanId,
        joinUrl: `${window.location.protocol}//${window.location.hostname}${
          window.location.port ? ':' + window.location.port : ''
        }/join/${humanId}`,
      } as Retro;

      const id = await createRetro(currentRetro, state.user);
      const retrievedRetro = await getRetro(id);

      dispatch({
        type: ActionType.SET_CURRENT_RETRO,
        payload: { retro: retrievedRetro },
      });

      const action: Action = {
        id: shortid.generate(),
        actionName: BoardActionType.UPDATE_RETRO_DETAILS,
        parameters: {
          retroName: retro?.name,
          retroTimeframe,
          retroGoal,
          joinUrl: `${window.location.protocol}//${window.location.hostname}${
            window.location.port ? ':' + window.location.port : ''
          }/join/${humanId}`,
          creatorId: state.currentRetro?.creatorId,
          userId: state.user.id,
          humanId: humanId,
          preferredNickname: userName,
          avatar: selectedAvatar,
          userType: userType,
          pulseCheck: selectedPulseCheck,
          template: selectedTemplate,
        },
        userId: state.user.id,
        timestamp: 0,
        sourceActionId: '',
        sourceActionTimestamp: 0,
        version: BOARD_STATE_MACHINE_VERSION,
      };
      await addRetroAction(id, action);
      return retrievedRetro;
    },
    getById: async (id: string): Promise<Retro | undefined> => {
      const retro = await getRetro(id);
      return retro;
    },
    getByHumanId: async (id: string): Promise<Retro | undefined> => {
      const retro = await getRetroByHumanId(id);
      return retro;
    },
  };
};
