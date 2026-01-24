package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.ScoringMode;

import java.util.Map;
import java.util.UUID;

public interface ScoreService {
    Map<UUID,Integer> calculateScores(String roomCode, ScoringMode mode);
}
