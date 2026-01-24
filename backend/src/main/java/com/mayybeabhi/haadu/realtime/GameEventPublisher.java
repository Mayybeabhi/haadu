package com.mayybeabhi.haadu.realtime;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class GameEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public GameEventPublisher(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate=messagingTemplate;
    }

    public void sendToRoom(String roomCode, GameEvent event){

        messagingTemplate.convertAndSend("/topic/rooms/"+roomCode,event);

    }

}
