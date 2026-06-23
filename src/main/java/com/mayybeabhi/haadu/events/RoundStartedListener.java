package com.mayybeabhi.haadu.events;

import com.mayybeabhi.haadu.realtime.GameEvent;
import com.mayybeabhi.haadu.realtime.GameEventPublisher;
import com.mayybeabhi.haadu.realtime.GameEventType;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class RoundStartedListener {

    private GameEventPublisher gameEventPublisher;

    public RoundStartedListener(GameEventPublisher  gameEventPublisher) {
        this.gameEventPublisher = gameEventPublisher;
    }

    @EventListener
    public void handle(RoundStartedEvent event){
        gameEventPublisher.sendToRoom(event.roomCode(), GameEvent.of(GameEventType.ROUND_STARTED, Map.of("roundNumber", event.roundNumber(),
                "roundId", event.roundId(),
                "songId", event.songId(),
                "youtubeUrl", event.youtubeUrl())));
    }
}
