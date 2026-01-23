package com.mayybeabhi.haadu.realtime;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
@AllArgsConstructor
public class GameEvent {

    private GameEventType type;
    private Map<String,Object> payload;
    private Instant timestamp;

    public static GameEvent of(GameEventType type, Map<String,Object> payload){
        return  new GameEvent(type,payload,Instant.now());
    }

}
