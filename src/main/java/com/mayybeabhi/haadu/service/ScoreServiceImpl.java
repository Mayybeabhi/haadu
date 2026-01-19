package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.ScoringMode;
import com.mayybeabhi.haadu.entity.Guess;
import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.entity.Round;
import com.mayybeabhi.haadu.exception.BusinessRuleException;
import com.mayybeabhi.haadu.exception.RoomNotFoundException;
import com.mayybeabhi.haadu.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ScoreServiceImpl implements ScoreService{

    private final RoomRepository roomRepository;
    private final RoundRepository roundRepository;
    private final SongSubmissionRepository songSubmissionRepository;
    private final GuessRepository guessRepository;
    private final RoomPlayerRepository roomPlayerRepository;

    public ScoreServiceImpl(RoomRepository roomRepository,RoundRepository roundRepository,SongSubmissionRepository songSubmissionRepository,GuessRepository guessRepository,RoomPlayerRepository roomPlayerRepository){
        this.roomRepository=roomRepository;
        this.roundRepository=roundRepository;
        this.songSubmissionRepository=songSubmissionRepository;
        this.guessRepository=guessRepository;
        this.roomPlayerRepository=roomPlayerRepository;
    }

    @Override
    @Transactional
    public Map<UUID,Integer> calculateScores(String roomCode, ScoringMode mode){
        Room room=roomRepository.findByRoomCode(roomCode).orElseThrow(()->new RoomNotFoundException("Room not found"));

        Map<UUID,Integer> scores=new HashMap<>();

        roomPlayerRepository.findByRoomId(room.getId())
                .forEach(p -> scores.put(p.getUserId(), 0));

        List<Round> rounds=roundRepository.findByRoomId(room.getId());

        for(Round round: rounds){
            if (round.getSongSubmissionId() == null) {
                continue;
            }
          UUID songOwnerId=songSubmissionRepository.findById(round.getSongSubmissionId()).orElseThrow().getUserId();

          List<Guess> guesses=guessRepository.findByRoundId(round.getId());

            if (guesses.isEmpty()) {
                continue;
            }
          switch(mode){
              case OWNER -> applyOwnerScoring(scores, songOwnerId,guesses);
              case GUESSER -> applyGuesserScoring(scores, songOwnerId,guesses);
            }
        }

        return scores;
    }

    private void applyOwnerScoring(Map<UUID,Integer> scores,UUID songOwnerId,List<Guess> guesses){
        for(Guess guess: guesses){
            if(!guess.getGuessedUserId().equals(songOwnerId)){
                scores.merge(songOwnerId,1,Integer::sum);
            }
        }
    }

    private void applyGuesserScoring(Map<UUID,Integer> scores,UUID songOwnerId,List<Guess> guesses){
        for(Guess guess:guesses){
            if(guess.getGuessedUserId().equals(songOwnerId)){
                scores.merge(guess.getGuessingUserId(),1,Integer::sum);
            }
        }
    }

}
