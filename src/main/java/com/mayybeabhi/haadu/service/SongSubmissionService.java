package com.mayybeabhi.haadu.service;

import org.springframework.stereotype.Service;


import com.mayybeabhi.haadu.entity.SongSubmission;
import java.util.*;

@Service
public interface SongSubmissionService {
    void submitSong(String roomCode,UUID userId,String youtubeUrl);
    List<SongSubmission> getUserRoomSongs(String roomCode,UUID userId);
    void updateSong(String roomCode, UUID songId, UUID userId, String youtubeUrl);
    SongSubmission getSong(String roomCode,String songId);
}
