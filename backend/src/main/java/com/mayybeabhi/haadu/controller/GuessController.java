package com.mayybeabhi.haadu.controller;

import com.mayybeabhi.haadu.dto.SubmitGuessRequest;
import com.mayybeabhi.haadu.service.GuessService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class GuessController {
    private final GuessService guessService;

    public GuessController(GuessService guessService){
        this.guessService=guessService;
    }

    @PostMapping("/{roomCode}/rounds/{roundId}/guess")
    public ResponseEntity<?> submitGuess(@PathVariable String roomCode, @PathVariable String roundId, @RequestBody SubmitGuessRequest request){
        guessService.submitGuess(roomCode,roundId, request.getGuessingUserId(), request.getGuessedUserId());

        return ResponseEntity.ok().build();
    }
}
