package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.repository.SongSubmissionRepository;
import org.springframework.stereotype.Service;

@Service
public interface SongSubmissionService {
    void submitSong(String roomCode,String userId,String youtubeUrl);
}
