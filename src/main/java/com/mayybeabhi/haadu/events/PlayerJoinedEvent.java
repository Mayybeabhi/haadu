package com.mayybeabhi.haadu.events;

import java.util.UUID;

public record PlayerJoinedEvent(String roomCode, UUID userId) {
}
