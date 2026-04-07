package com.mayybeabhi.haadu.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerGameStateDto {
    private UUID userId;
    private String username;
    private Boolean isAdmin;
    private Integer songsSubmitted;

    private Boolean guessSubmitted;
    private UUID guessTargetUserId; // only for this player's own guess if needed
}