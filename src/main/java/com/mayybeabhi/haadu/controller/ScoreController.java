package com.mayybeabhi.haadu.controller;

import com.mayybeabhi.haadu.ScoringMode;
import com.mayybeabhi.haadu.dto.PlayerScoreResponse;
import com.mayybeabhi.haadu.service.ScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms/{roomCode}/scores")
public class ScoreController {
    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService){
        this.scoreService=scoreService;
    }

    @GetMapping
    public ResponseEntity<List<PlayerScoreResponse>> calculateScores(@PathVariable String roomCode, @RequestParam ScoringMode mode){

        return ResponseEntity.ok(scoreService.calculateScores(roomCode, mode));
    }

}
