package com.mayybeabhi.haadu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerScoreResponse {

    private UUID userId;

    private String username;

    private Integer score;
}
