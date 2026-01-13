package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.entity.RoomStatus;
import com.mayybeabhi.haadu.entity.SongSubmission;
import com.mayybeabhi.haadu.exception.GameAlreadyStartedException;
import com.mayybeabhi.haadu.exception.InvalidGameStatusException;
import com.mayybeabhi.haadu.exception.UserNotInRoomException;
import com.mayybeabhi.haadu.repository.RoomPlayerRepository;
import com.mayybeabhi.haadu.repository.RoomRepository;
import com.mayybeabhi.haadu.repository.SongSubmissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SongSubmissionServiceImpl implements SongSubmissionService{
    private final SongSubmissionRepository songSubmissionRepository;
    private final RoomPlayerRepository roomPlayerRepository;
    private final RoomRepository roomRepository;

    public SongSubmissionServiceImpl(SongSubmissionRepository songSubmissionRepository,RoomPlayerRepository roomPlayerRepository, RoomRepository roomRepository){
        this.songSubmissionRepository=songSubmissionRepository;
        this.roomPlayerRepository=roomPlayerRepository;
        this.roomRepository=roomRepository;
    }

    @Override
    @Transactional
    public void submitSong(String roomCode, String userId,String youtubeUrl){
        UUID roomId=roomRepository.findByRoomCode(roomCode).get().getId();
        UUID userUUID=UUID.fromString(userId);
        if (!roomPlayerRepository.existsByRoomIdAndUserId(roomId,userUUID)){
            throw new UserNotInRoomException("User is not in the room");
        }

        if (!roomRepository.findById(roomId).get().getStatus().equals(RoomStatus.WAITING)){
            throw new GameAlreadyStartedException("Song submission closed!");
        }

        if (songSubmissionRepository.existsByRoomIdAndUserIdAndYoutubeUrl(roomId,userUUID,youtubeUrl)){
            throw new InvalidGameStatusException("Song already submitted");
        }
        if (songSubmissionRepository.countByRoomIdAndUserId(roomId,userUUID)>=roomRepository.findById(roomId).get().getSongCount()){
            throw new InvalidGameStatusException("All songs have been already submitted");
        }

        SongSubmission song =new SongSubmission();

        song.setRoomId(roomId);
        song.setUserId(userUUID);
        song.setYoutubeUrl(youtubeUrl);

        songSubmissionRepository.save(song);

    }
}
