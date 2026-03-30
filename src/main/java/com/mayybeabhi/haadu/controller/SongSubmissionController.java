package com.mayybeabhi.haadu.controller;


import com.mayybeabhi.haadu.dto.SubmitSongRequest;
import com.mayybeabhi.haadu.entity.SongSubmission;
import com.mayybeabhi.haadu.repository.SongSubmissionRepository;
import com.mayybeabhi.haadu.service.SongSubmissionService;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms/{roomCode}/songs")
public class SongSubmissionController {
    private final SongSubmissionService songSubmissionService;
    private final SongSubmissionRepository songSubmissionRepository;

    public SongSubmissionController(SongSubmissionService songSubmissionService,SongSubmissionRepository songSubmissionRepository) {
        this.songSubmissionService=songSubmissionService;
        this.songSubmissionRepository=songSubmissionRepository;
    }

    @PostMapping
    public ResponseEntity<Void> submitSong(@PathVariable String roomCode, @RequestBody SubmitSongRequest request){
        songSubmissionService.submitSong(roomCode, request.getUserId(), request.getYoutubeUrl());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{songId}")
    public ResponseEntity<SongSubmission> getSong(@PathVariable String roomCode, @PathVariable String songId){
    return ResponseEntity.ok(
        songSubmissionRepository.findById(UUID.fromString(songId))
            .orElseThrow(() -> new RuntimeException("Song not found"))
    );
}
}
