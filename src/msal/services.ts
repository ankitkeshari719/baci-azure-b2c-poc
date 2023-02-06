import { Action, Retro, User } from "../types";
import { useSocket } from "../hooks/useSocket";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

import { API_URL } from '../constants/FeatureFlags';

export const createRetro = async (retro: Omit<Retro, 'id'>, creator: User): Promise<string> => {let id="";
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retro, creator })
    };
    await fetch(API_URL+'/createRetro', requestOptions)
        .then(response => response.json())
        .then(data => {id = data.id;} );
    return id;
}

export const getRetro = async (id: string): Promise<Retro> => {
    let retro = new Retro();
    const requestOptions = {
        method: 'GET'
    };
    await fetch(API_URL+`/getRetro?id=${id}`, requestOptions)
        .then(response => response.json())
        .then(data => {retro = data.retro[0]} );
    if (retro) {
        retro.id = id;
    }
    return retro;
    
}

export const getRetroByHumanId = async (humanId: string): Promise<Retro | undefined> => {
    let retro = new Array;
    let result: Retro | undefined = undefined;
    const requestOptions = {
        method: 'GET'
    };
    await fetch(API_URL+`/getRetroByHumanId?id=${humanId}`, requestOptions)
        .then(response => response.json())
        .then(data => {retro = data.retro} );
    retro.forEach(snapshot => {
        result = { ...snapshot as Retro, id: snapshot._id };
    });

    return result;
}
export const getRetroActions = async (id: string, userId: string, fromTimestamp?: number):
    Promise<Action[]> => {
    let snapshot: any[] = [];
    const results: any[] = [];
    const requestOptions = {
        method: 'GET'
    };
    await fetch(API_URL+`/getRetroActions?id=${id}&userId=${userId}&fromTimestamp=${fromTimestamp}`, requestOptions)
        .then(response => response.json())
        .then(data => {snapshot = data.retro} );
    if (snapshot.length !== 0 ){
    snapshot[0].action.forEach((doc: any) => {
        const data = doc;
        if (!data.onlyVisibleBy || data.onlyVisibleBy.includes(userId)) {
            results.push(data);
        }
    });
    const sortedActions = results.sort(
        (a: any, b: any) =>
            a.sourceActionTimestamp !== b.sourceActionTimestamp ?
                a.sourceActionTimestamp - b.sourceActionTimestamp :
                a.timestamp - b.timestamp);
    return sortedActions.map((action, index) => ({
        ...action,
        timestamp: action.timestamp,
        date: action.timestamp || new Date(),
        sourceActionTimestamp: action.sourceActionTimestamp
    }));
    }
    return results;
}

export const addRetroAction = async (retroId: string, action: Action): Promise<string> => {
    let id="";
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retroId, action })
    };
    await fetch(API_URL+'/addRetroAction', requestOptions)
        .then(response => response.json())
        .then(data => {id = data.id} );
    return id;

}

export const addFeedback = async (retroId: string, user: User, rating: number, comment: string): Promise<string> => {
    let id="";
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retroId, user, rating, comment })
    };
    await fetch(API_URL+'/addFeedback', requestOptions)
        .then(response => response.json())
        .then(data => {id = data.id} );
    return id;

}
/* 
export const onSnapshotRetroActions = (socket: Socket<DefaultEventsMap, DefaultEventsMap>,id: string, userId: string, fromTimestamp: number | undefined, callback: (([]) => void)): () => void => {
        const unsubscribe = socket.on('newMessage',(snapshot: { retroId: string; action: any; }[]) => {
        const results = [] as any[];
        console.log("Got Snaphsot message !!!!",snapshot,'length-----',snapshot.length);
        snapshot.forEach((change: { retroId: string; action: any; }) => {
            console.log("change",change);
            // if ((change.type === "modified" || change.type === "added") && !change.doc.metadata.hasPendingWrites) {
            if (change.retroId === id) {    
                const data = change.action;
                if (!data.onlyVisibleBy || data.onlyVisibleBy.includes(userId)) {
                    results.push(data);
                }
                console.log('results',results)
            }
            // }
        });
        callback(
            results.sort(
            (a: any, b: any) =>
                a.sourceActionTimestamp.toMillis() !== b.sourceActionTimestamp.toMillis() ?
                    a.sourceActionTimestamp.toMillis() - b.sourceActionTimestamp.toMillis() :
                    a.timestamp.toMillis() - b.timestamp.toMillis())
            .map((action) =>
            ({
                ...action,
                timestamp: action.timestamp?.toMillis(),
                date: action.timestamp?.toDate() || new Date(),
                sourceActionTimestamp: action.sourceActionTimestamp?.toMillis(),
            })));
    });
    const id2 = Math.random();
    return () => {
        unsubscribe;
    };
} */