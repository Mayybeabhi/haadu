package com.mayybeabhi.haadu.dto;

import java.util.UUID;

public record GuessResponse(
        UUID guessingUserId,
        UUID guessedUserId
) {
}