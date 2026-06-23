package com.mayybeabhi.haadu.events;

import java.util.UUID;

public record RoundStartedEvent(String roomCode, int roundNumber, UUID roundId,UUID songId,String youtubeUrl) {
}
