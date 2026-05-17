package com.mayybeabhi.haadu.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class RoundHistoryResponse {

    private Integer roundNumber;

    private String youtubeUrl;

    private String ownerUsername;

    private Map<String, GuessCellResponse> playerGuesses;
}