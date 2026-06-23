package com.mayybeabhi.haadu.events;

import com.mayybeabhi.haadu.realtime.GameEvent;
import com.mayybeabhi.haadu.realtime.GameEventPublisher;
import com.mayybeabhi.haadu.realtime.GameEventType;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class SongSubmittedListener {
    private final GameEventPublisher gameEventPublisher;

    public SongSubmittedListener(GameEventPublisher gameEventPublisher) {
        this.gameEventPublisher = gameEventPublisher;
    }

    @EventListener
    public void handle(SongSubmittedEvent event){
        gameEventPublisher.sendToRoom(event.roomCode(), GameEvent.of(GameEventType.SONG_SUBMITTED, Map.of()));
    }
}
