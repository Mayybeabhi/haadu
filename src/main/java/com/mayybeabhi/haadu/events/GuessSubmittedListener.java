package com.mayybeabhi.haadu.events;

import com.mayybeabhi.haadu.realtime.GameEvent;
import com.mayybeabhi.haadu.realtime.GameEventPublisher;
import com.mayybeabhi.haadu.realtime.GameEventType;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class GuessSubmittedListener {
    private final GameEventPublisher gameEventPublisher;

    public GuessSubmittedListener(GameEventPublisher gameEventPublisher) {
        this.gameEventPublisher=gameEventPublisher;
    }

    @EventListener
    public void handle(GuessSubmittedEvent event){
        gameEventPublisher.sendToRoom(event.roomCode(), GameEvent.of(GameEventType.GUESS_SUBMITTED, Map.of("guessingUserId", event.guessingUserId(),
                "guessedUserId", event.guessedUserId())));
    }
}
