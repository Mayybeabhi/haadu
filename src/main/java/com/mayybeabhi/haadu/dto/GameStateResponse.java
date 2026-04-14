package com.mayybeabhi.haadu.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameStateResponse {
    private String roomCode;
    private String roomStatus;     // WAITING, IN_PROGRESS, FINISHED
    private String phase;          // LOBBY, WAITING_ROUND, PLAYING, REVEALED, FINISHED

    private Integer roundNumber;
    private UUID currentRoundId;
    private String roundStatus;    // WAITING, PLAYING, REVEALED
    private UUID songId;
    private String currentSongUrl; // send only if round is active
    private UUID revealedOwnerId;  // null until revealed

    private Integer maxPlayers;
    private Integer songCount;
    private Boolean breakTimeEnabled;
    private Integer breakTimeSeconds;
    private Boolean roundTimeEnabled;
    private Integer roundTimeSeconds;

    private List<PlayerGameStateDto> players;
    private List<GuessResponse> guesses;
}