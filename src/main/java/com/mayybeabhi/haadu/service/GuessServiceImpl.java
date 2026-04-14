package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.entity.Guess;
import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.entity.Round;
import com.mayybeabhi.haadu.entity.RoundStatus;
import com.mayybeabhi.haadu.exception.*;
import com.mayybeabhi.haadu.realtime.GameEvent;
import com.mayybeabhi.haadu.realtime.GameEventPublisher;
import com.mayybeabhi.haadu.realtime.GameEventType;
import com.mayybeabhi.haadu.repository.*;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class GuessServiceImpl implements GuessService{
    private final RoomRepository roomRepository;
    private final RoomPlayerRepository roomPlayerRepository;
    private final RoundRepository roundRepository;
    private final GuessRepository guessRepository;
    private final GameEventPublisher gameEventPublisher;

    public GuessServiceImpl(RoomRepository roomRepository, RoomPlayerRepository roomPlayerRepository,  RoundRepository roundRepository,GuessRepository guessRepository,GameEventPublisher gameEventPublisher){
        this.roomRepository=roomRepository;
        this.roomPlayerRepository=roomPlayerRepository;
        this.roundRepository=roundRepository;
        this.guessRepository=guessRepository;
        this.gameEventPublisher=gameEventPublisher;
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

        gameEventPublisher.sendToRoom(roomCode,GameEvent.of(GameEventType.GUESS_SUBMITTED,Map.of( "guessingUserId", guessingUserId, "guessedUserId", guessedUserId)));

    }
}
