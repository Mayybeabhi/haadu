package com.mayybeabhi.haadu.controller;


import com.mayybeabhi.haadu.dto.SubmitSongRequest;
import com.mayybeabhi.haadu.service.SongSubmissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms/{roomCode}/songs")
public class SongSubmissionController {
    private final SongSubmissionService songSubmissionService;

    public SongSubmissionController(SongSubmissionService songSubmissionService) {
        this.songSubmissionService=songSubmissionService;
    }

    @PostMapping
    public ResponseEntity<Void> submitSong(@PathVariable String roomCode, @RequestBody SubmitSongRequest request){
        songSubmissionService.submitSong(roomCode, request.getUserId(), request.getYoutubeUrl());
        return ResponseEntity.ok().build();
    }
}
