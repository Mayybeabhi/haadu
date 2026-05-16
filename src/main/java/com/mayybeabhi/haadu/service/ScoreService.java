package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.ScoringMode;
import com.mayybeabhi.haadu.dto.PlayerScoreResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ScoreService {
    List<PlayerScoreResponse> calculateScores(String roomCode, ScoringMode mode);
}
