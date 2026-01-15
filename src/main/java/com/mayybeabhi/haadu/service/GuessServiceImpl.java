package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.entity.Guess;
import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.entity.Round;
import com.mayybeabhi.haadu.entity.RoundStatus;
import com.mayybeabhi.haadu.exception.*;
import com.mayybeabhi.haadu.repository.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GuessServiceImpl implements GuessService{
    private final RoomRepository roomRepository;
    private final RoomPlayerRepository roomPlayerRepository;
    private final UserRepository userRepository;
    private final SongSubmissionRepository songSubmissionRepository;
    private final RoundRepository roundRepository;
    private final GuessRepository guessRepository;

    public GuessServiceImpl(RoomRepository roomRepository, RoomPlayerRepository roomPlayerRepository, UserRepository userRepository, SongSubmissionRepository songSubmissionRepository, RoundRepository roundRepository,GuessRepository guessRepository){
        this.roomRepository=roomRepository;
        this.roomPlayerRepository=roomPlayerRepository;
        this.userRepository=userRepository;
        this.songSubmissionRepository=songSubmissionRepository;
        this.roundRepository=roundRepository;
        this.guessRepository=guessRepository;
    }

    public void submitGuess(String roomCode,String roundId,String guessingUserId, String guessedUserId){

        Room room=roomRepository.findByRoomCode(roomCode).orElseThrow(()->new RoomNotFoundException("Room not found"));
        UUID roundUUID=UUID.fromString(roundId);
        UUID guessingUserUUID=UUID.fromString(guessingUserId);
        UUID guessedUserUUID=UUID.fromString(guessedUserId);
        Round round=roundRepository.findById(roundUUID).orElseThrow(()-> new RoundNotFoundException("Round not found"));

        if(!round.getStatus().equals(RoundStatus.PLAYING)){
            throw new InvalidGameStatusException("Round is not active");
        }

        if(!round.getRoomId().equals(room.getId())){
            throw new InvalidGameStatusException("Invalid round");
        }

        if(!roomPlayerRepository.existsByRoomIdAndUserId(room.getId(),guessingUserUUID)){
            throw new UserNotInRoomException("Player is not in the room");
        }

        if(!roomPlayerRepository.existsByRoomIdAndUserId(room.getId(),guessedUserUUID)){
            throw new UserNotInRoomException("Guessed player is not in the room");
        }

        if(guessRepository.existsByRoundIdAndGuessingUserId(roundUUID,guessingUserUUID)){
            throw new BusinessRuleException("Player has already guessed");
        }

        if(guessedUserId.equals(guessingUserId)){
            throw new BusinessRuleException("Cannot guess yourself");
        }

        Guess guess = new Guess();

        guess.setGuessingUserId(guessingUserUUID);
        guess.setGuessedUserId(guessedUserUUID);
        guess.setRoundId(roundUUID);
        guessRepository.save(guess);

    }
}
