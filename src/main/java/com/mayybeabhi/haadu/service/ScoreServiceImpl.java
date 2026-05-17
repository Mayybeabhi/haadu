package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.ScoringMode;
import com.mayybeabhi.haadu.dto.GuessCellResponse;
import com.mayybeabhi.haadu.dto.PlayerScoreResponse;
import com.mayybeabhi.haadu.dto.RoundHistoryResponse;
import com.mayybeabhi.haadu.entity.*;
import com.mayybeabhi.haadu.exception.RoomNotFoundException;
import com.mayybeabhi.haadu.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ScoreServiceImpl implements ScoreService{

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoundRepository roundRepository;
    private final SongSubmissionRepository songSubmissionRepository;
    private final GuessRepository guessRepository;
    private final RoomPlayerRepository roomPlayerRepository;

    public ScoreServiceImpl(UserRepository userRepository,RoomRepository roomRepository,RoundRepository roundRepository,SongSubmissionRepository songSubmissionRepository,GuessRepository guessRepository,RoomPlayerRepository roomPlayerRepository){
        this.userRepository=userRepository;
        this.roomRepository=roomRepository;
        this.roundRepository=roundRepository;
        this.songSubmissionRepository=songSubmissionRepository;
        this.guessRepository=guessRepository;
        this.roomPlayerRepository=roomPlayerRepository;
    }

    @Override
    @Transactional
    public List<PlayerScoreResponse> calculateScores(String roomCode, ScoringMode mode){
        Room room=roomRepository.findByRoomCode(roomCode).orElseThrow(()->new RoomNotFoundException("Room not found"));

        Map<UUID,Integer> scores=new HashMap<>();

        roomPlayerRepository.findByRoomId(room.getId())
                .forEach(p -> scores.put(p.getUserId(), 0));

        List<Round> rounds=roundRepository.findByRoomId(room.getId());

        for(Round round: rounds){
            if (!round.getStatus().equals(RoundStatus.REVEALED)) {
                continue;
            }
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

        return scores.entrySet().stream().map(entry -> {
            User user = userRepository.findById(entry.getKey()).orElseThrow();
            return PlayerScoreResponse.builder().userId(user.getId()).username(user.getUsername()).score(entry.getValue()).build();}).toList();
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

    @Override
    @Transactional
    public List<RoundHistoryResponse> getRoundHistory(String roomCode) {

        Room room = roomRepository.findByRoomCode(roomCode).orElseThrow(() -> new RoomNotFoundException("Room not found"));

        List<Round> rounds = roundRepository.findByRoomId(room.getId());

        List<RoundHistoryResponse> response = new ArrayList<>();

        for (Round round : rounds) {

            if (!round.getStatus().equals(RoundStatus.REVEALED)) {
                continue;
            }

            SongSubmission song = songSubmissionRepository.findById(round.getSongSubmissionId()).orElseThrow();

            User owner = userRepository.findById(song.getUserId()).orElseThrow();

            List<Guess> guesses = guessRepository.findByRoundId(round.getId());

            Map<String, GuessCellResponse> playerGuesses = new LinkedHashMap<>();

            for (Guess guess : guesses) {

                User player = userRepository.findById(guess.getGuessingUserId()).orElseThrow();

                User guessedUser = userRepository.findById(guess.getGuessedUserId()).orElseThrow();

                boolean correct = guessedUser.getId().equals(owner.getId());

                playerGuesses.put(player.getUsername(), GuessCellResponse.builder().guessedUsername(guessedUser.getUsername()).correct(correct).build());
            }

            response.add(RoundHistoryResponse.builder().roundNumber(round.getRoundNumber()).youtubeUrl(song.getYoutubeUrl()).ownerUsername(owner.getUsername()).playerGuesses(playerGuesses).build());
        }

        return response;
        }

}
