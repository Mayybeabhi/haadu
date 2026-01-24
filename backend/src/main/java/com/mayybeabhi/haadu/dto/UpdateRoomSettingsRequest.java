package com.mayybeabhi.haadu.dto;

import lombok.Data;

@Data
public class UpdateRoomSettingsRequest {

    private String adminUserId;

    private Boolean isRoundTimerEnabled;
    private Integer roundDuration;

    private Boolean isInBetweenRoundTimerEnabled;
    private Integer inBetweenRoundDuration;

    private Integer maxPlayers;
    private Integer songCount;
}
