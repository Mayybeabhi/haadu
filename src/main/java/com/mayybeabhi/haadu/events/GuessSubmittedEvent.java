package com.mayybeabhi.haadu.events;

import java.util.UUID;

public record GuessSubmittedEvent(String roomCode, UUID guessingUserId, UUID guessedUserId) {

}
