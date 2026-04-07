package com.mayybeabhi.haadu.dto;

import com.mayybeabhi.haadu.entity.RoomStatus;
import com.mayybeabhi.haadu.entity.RoundStatus;

import java.util.List;
import java.util.UUID;

public record GameStateResponse(
        RoomStatus roomStatus,
        UUID currentRoundId,
        Integer roundNumber,
        RoundStatus roundStatus,
        UUID songId,
        UUID revealedOwnerId,
        List<GuessResponse> guesses
) {
}