package com.mayybeabhi.haadu.service;


import com.mayybeabhi.haadu.entity.RoomStatus;
import com.mayybeabhi.haadu.entity.SongSubmission;
import com.mayybeabhi.haadu.exception.GameAlreadyStartedException;
import com.mayybeabhi.haadu.exception.InvalidGameStatusException;
import com.mayybeabhi.haadu.exception.UserNotInRoomException;
import com.mayybeabhi.haadu.realtime.GameEvent;
import com.mayybeabhi.haadu.realtime.GameEventPublisher;
import com.mayybeabhi.haadu.realtime.GameEventType;
import com.mayybeabhi.haadu.repository.RoomPlayerRepository;
import com.mayybeabhi.haadu.repository.RoomRepository;
import com.mayybeabhi.haadu.repository.SongSubmissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SongSubmissionServiceImpl implements SongSubmissionService{
    private final SongSubmissionRepository songSubmissionRepository;
    private final RoomPlayerRepository roomPlayerRepository;
    private final RoomRepository roomRepository;
    private final GameEventPublisher gameEventPublisher;

    public SongSubmissionServiceImpl(SongSubmissionRepository songSubmissionRepository,RoomPlayerRepository roomPlayerRepository, RoomRepository roomRepository,GameEventPublisher gameEventPublisher){
        this.songSubmissionRepository=songSubmissionRepository;
        this.roomPlayerRepository=roomPlayerRepository;
        this.roomRepository=roomRepository;
        this.gameEventPublisher=gameEventPublisher;
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
        
        gameEventPublisher.sendToRoom(roomCode,GameEvent.of(GameEventType.SONG_SUBMITTED,Map.of("userId", userId, "roomCode", roomCode)));

    }

    @Override
    @Transactional
    public List<SongSubmission> getUserRoomSongs(String roomCode,String userId){
        UUID roomId= roomRepository.findByRoomCode(roomCode).get().getId();
        UUID userUUID= UUID.fromString(userId);
        List<SongSubmission> list= songSubmissionRepository.findByRoomIdAndUserId(roomId,userUUID);
        return list;
    }
}
