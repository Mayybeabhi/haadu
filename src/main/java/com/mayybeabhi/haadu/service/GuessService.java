package com.mayybeabhi.haadu.service;

import java.util.UUID;

public interface GuessService {
    void submitGuess(String roomCode, String roundId, UUID guessingUsedId, String guessedUserId);
}
