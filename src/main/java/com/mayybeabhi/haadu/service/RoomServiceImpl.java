package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.dto.UpdateRoomSettingsRequest;
import com.mayybeabhi.haadu.entity.*;
import com.mayybeabhi.haadu.exception.*;
import com.mayybeabhi.haadu.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class RoomServiceImpl implements RoomService{
    private final RoomRepository roomRepository;
    private final RoomPlayerRepository roomPlayerRepository;
    private final UserRepository userRepository;
    private final SongSubmissionRepository songSubmissionRepository;
    private final RoundRepository roundRepository;

    public RoomServiceImpl(RoomRepository roomRepository, RoomPlayerRepository roomPlayerRepository,UserRepository userRepository,SongSubmissionRepository songSubmissionRepository,RoundRepository roundRepository){
        this.roomRepository=roomRepository;
        this.roomPlayerRepository=roomPlayerRepository;
        this.userRepository=userRepository;
        this.songSubmissionRepository=songSubmissionRepository;
        this.roundRepository=roundRepository;
    }

    @Override
    @Transactional
    public Room createRoom(String adminUserId){

        if(!userRepository.existsById(UUID.fromString(adminUserId))){
            throw new UserNotFoundException("User not found!");
        }

        Room room = new Room();

        room.setRoomCode(generateRoomCode());
        room.setAdminUserId(UUID.fromString(adminUserId));
        room.setMaxPlayers(2);
        room.setSongCount(4);
        room.setStatus(RoomStatus.WAITING);
        room.setRoundTimerEnabled(false);
        room.setInBetweenRoundTimerEnabled(false);


        Room savedRoom = roomRepository.save(room);

        RoomPlayer adminPlayer=new RoomPlayer();
        adminPlayer.setRoomId(room.getId());
        adminPlayer.setUserId(UUID.fromString(adminUserId));
        adminPlayer.setScore(0);
        roomPlayerRepository.save(adminPlayer);
        return savedRoom;
    }

    @Override
    public Room getRoomByCode(String roomCode){
        return roomRepository.findByRoomCode(roomCode).orElseThrow(() -> new RoomNotFoundException("Room not found"));
    }

    private String generateRoomCode(){
        return UUID.randomUUID().toString().substring(0,5).toUpperCase();
    }

    @Override
    @Transactional
    public void joinRoom(String roomCode,String userID){
      Room room = getRoomByCode(roomCode);
      UUID userUUID = UUID.fromString(userID);

      if(!userRepository.existsById(userUUID)){
            throw new UserNotFoundException("User not found!");
      }

      if(roomPlayerRepository.existsByRoomIdAndUserId(room.getId(),userUUID)){
          throw new UserAlreadyInRoomException("User already present in room");
      }
      if (roomPlayerRepository.countByRoomId(room.getId())>=room.getMaxPlayers()){
          throw new RoomFullException("Room full!");
      }

        if (room.getStatus() != RoomStatus.WAITING) {
            throw new IllegalStateException("Cannot join room after game has started");
        }


        RoomPlayer player=new RoomPlayer();
      player.setRoomId(room.getId());
      player.setUserId(userUUID);
      player.setScore(0);

      roomPlayerRepository.save(player);

    }
    
    @Override
    @Transactional
    public Room updateRoomSettings(String roomCode, UpdateRoomSettingsRequest request){
        Room room= roomRepository.findByRoomCode(roomCode).orElseThrow(() -> new RoomNotFoundException("Invalid room code, room not found"));
        UUID adminUserUUID=UUID.fromString(request.getAdminUserId());

        if(!room.getAdminUserId().equals(adminUserUUID)){
            throw new UserNotAdminException("Only admin of the room can edit settings");
        }

        if (!room.getStatus().equals(RoomStatus.WAITING)){
            throw new InvalidGameStatusException("Cannot update settings after game has started");
        }

        room.setRoundTimerEnabled(request.getIsRoundTimerEnabled());
        if(request.getIsRoundTimerEnabled()){
            if (request.getRoundDuration()==null||request.getRoundDuration()<=0){
                throw new BusinessRuleException("Round duration must be greater than 0");
            }

            room.setRoundTimer(request.getRoundDuration());
        }
        else {
            room.setRoundTimer(0);
        }

        room.setInBetweenRoundTimerEnabled(request.getIsInBetweenRoundTimerEnabled());
        if(request.getIsInBetweenRoundTimerEnabled()){
            if (request.getInBetweenRoundDuration()==null||request.getInBetweenRoundDuration()<=0){
                throw new BusinessRuleException("In Between Round duration must be greater than 0");
            }

            room.setRoundTimer(request.getRoundDuration());
        }
        else {
            room.setRoundTimer(0);
        }

        room.setMaxPlayers(request.getMaxPlayers());
        room.setSongCount(request.getSongCount());



        return roomRepository.save(room);



    }

    @Override
    @Transactional
    public void startGame(String roomCode, String adminUserId){
        Room room=roomRepository.findByRoomCode(roomCode).orElseThrow(()->new RoomNotFoundException("Room not found"));
        UUID adminUUID=UUID.fromString(adminUserId);
        if (!room.getAdminUserId().equals(adminUUID)){
            throw new UserNotAdminException("Only admins can start the game!");
        }

        if(!room.getStatus().equals(RoomStatus.WAITING)){
            throw new InvalidGameStatusException("Invalid game status");
        }

        long roomPlayersCount=roomPlayerRepository.countByRoomId(room.getId());

        if (roomPlayersCount<2){
            throw new InvalidGameStatusException("Not enough players to start the game");
        }

        if(roomPlayersCount*room.getSongCount()!=songSubmissionRepository.countByRoomId(room.getId())){
            throw new InvalidGameStatusException("All users have not submitted the required number of songs");
        }

        room.setStatus(RoomStatus.PLAYING);
        roomRepository.save(room);
    }

    @Override
    @Transactional
    public void startRound(String roomCode,String adminUserId){
        Room room= roomRepository.findByRoomCode(roomCode).orElseThrow(()->new RoomNotFoundException("Room not found!"));
        UUID adminUUID=UUID.fromString(adminUserId);

        if (!room.getAdminUserId().equals(adminUUID)){
            throw new UserNotAdminException("Only admins can start a round");
        }

        if(!room.getStatus().equals(RoomStatus.PLAYING)){
            throw new InvalidGameStatusException("Game has not started");
        }

        if(roundRepository.existsByRoomIdAndStatus(room.getId(), RoundStatus.PLAYING)){
            throw new InvalidGameStatusException("A round is already active");
        }

        long countRounds=roundRepository.countByRoomId(room.getId());

        if (countRounds>=room.getSongCount()){
            throw new InvalidGameStatusException("All rounds have been completed");
        }

        List<SongSubmission> unusedSongs=songSubmissionRepository.findUnusedSongsByRoomId(room.getId());

        if(unusedSongs.isEmpty()){
            throw new InvalidGameStatusException("No songs available");
        }

        SongSubmission selectedSong= unusedSongs.get(new Random().nextInt(unusedSongs.size()));
        int roundNumber= (int)countRounds+1;

        Round round=new Round();

        round.setRoomId(room.getId());
        round.setRoundNumber(roundNumber);
        round.setStatus(RoundStatus.PLAYING);
        round.setSongSubmissionId(selectedSong.getId());
        round.setStartedAt(Instant.now());

        roundRepository.save(round);

    }
}
