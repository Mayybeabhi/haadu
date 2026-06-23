package com.mayybeabhi.haadu.events;

import java.util.UUID;

public record RoundClosedEvent(String roomCode, UUID correctUserId) {
}
