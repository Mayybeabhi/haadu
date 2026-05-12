package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.dto.SubmitGuessRequest;

import java.util.UUID;

public interface GuessService {
    void submitGuess(String roomCode, String roundId, UUID guessingUsedId, SubmitGuessRequest request);
}
