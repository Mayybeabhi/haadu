package com.mayybeabhi.haadu.controller;


import com.mayybeabhi.haadu.dto.SongSubmissionResponse;
import com.mayybeabhi.haadu.dto.SubmitSongRequest;
import com.mayybeabhi.haadu.dto.UpdateSongRequest;
import com.mayybeabhi.haadu.entity.SongSubmission;
import com.mayybeabhi.haadu.repository.SongSubmissionRepository;
import com.mayybeabhi.haadu.security.SecurityUtils;
import com.mayybeabhi.haadu.service.SongSubmissionService;

import java.util.*;

import jakarta.validation.Valid;
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
    public ResponseEntity<Void> submitSong(@PathVariable String roomCode,@Valid @RequestBody SubmitSongRequest request){
        songSubmissionService.submitSong(roomCode, SecurityUtils.getCurrentUserId(), request.getYoutubeUrl());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{songId}")
    public ResponseEntity<SongSubmissionResponse> getSong(@PathVariable String roomCode, @PathVariable String songId){

        SongSubmission song = songSubmissionService.getSong(roomCode,songId);

        return ResponseEntity.ok(SongSubmissionResponse.builder().id(song.getId()).userId(song.getUserId()).youtubeUrl(song.getYoutubeUrl()).build()
        );
    }

    @GetMapping
    public ResponseEntity<List<SongSubmissionResponse>> getUserRoomSongs(@PathVariable String roomCode){

        List<SongSubmission> songs = songSubmissionService.getUserRoomSongs(roomCode, SecurityUtils.getCurrentUserId());

        List<SongSubmissionResponse> response = songs.stream().map(song -> SongSubmissionResponse.builder().id(song.getId()).userId(song.getUserId()).youtubeUrl(song.getYoutubeUrl()).build()).toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{songId}")
    public ResponseEntity<?> updateSong(@PathVariable String roomCode, @PathVariable UUID songId,@Valid @RequestBody UpdateSongRequest request){
        songSubmissionService.updateSong(roomCode, songId, SecurityUtils.getCurrentUserId(), request.getYoutubeUrl());

        return ResponseEntity.ok().build();
    }
}
