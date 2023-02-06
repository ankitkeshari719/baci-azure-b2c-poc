import { useEffect,useState,createContext,ReactChild } from "react";
import socketIOClient from "socket.io-client";
import { API_URL } from './FeatureFlags';
import React, {Component} from 'react';


const ws =  socketIOClient(API_URL);
//const ws = socketIOClient("https://baciapi.azurewebsites.net");


export const SocketContext = createContext(ws)

interface ISocketProvider {
    children: ReactChild;
}

export const SocketProvider = (props:ISocketProvider) => (
    <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
);