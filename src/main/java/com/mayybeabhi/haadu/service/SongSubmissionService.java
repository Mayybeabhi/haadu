package com.mayybeabhi.haadu.service;

import org.springframework.stereotype.Service;


import com.mayybeabhi.haadu.entity.SongSubmission;
import java.util.*;

@Service
public interface SongSubmissionService {
    void submitSong(String roomCode,String userId,String youtubeUrl);
    List<SongSubmission> getUserRoomSongs(String roomCode,String userId);
}
