package com.mayybeabhi.haadu.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRoomSettingsRequest {
    @NotNull
    private Boolean isRoundTimerEnabled;
    @Min(value = 0, message = "Round duration cannot be negative")
    private Integer roundDuration;
    @NotNull
    private Boolean isInBetweenRoundTimerEnabled;
    @Min(value = 0, message = "Break duration cannot be negative")
    private Integer inBetweenRoundDuration;

    @Min(value = 2, message = "Minimum 2 players required")
    @Max(value = 20, message = "Maximum 20 players allowed")
    private Integer maxPlayers;
    @Min(value = 1, message = "At least 1 song required")
    @Max(value = 20, message = "Maximum 20 songs allowed")
    private Integer songCount;
}
