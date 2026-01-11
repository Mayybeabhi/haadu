package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.entity.RoomPlayer;
import com.mayybeabhi.haadu.entity.RoomStatus;
import com.mayybeabhi.haadu.exception.RoomFullException;
import com.mayybeabhi.haadu.exception.RoomNotFoundException;
import com.mayybeabhi.haadu.exception.UserAlreadyInRoomException;
import com.mayybeabhi.haadu.exception.UserNotFoundException;
import com.mayybeabhi.haadu.repository.RoomPlayerRepository;
import com.mayybeabhi.haadu.repository.RoomRepository;
import com.mayybeabhi.haadu.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class RoomServiceImpl implements RoomService{
    private final RoomRepository roomRepository;
    private final RoomPlayerRepository roomPlayerRepository;
    private final UserRepository userRepository;

    public RoomServiceImpl(RoomRepository roomRepository, RoomPlayerRepository roomPlayerRepository,UserRepository userRepository){
        this.roomRepository=roomRepository;
        this.roomPlayerRepository=roomPlayerRepository;
        this.userRepository=userRepository;
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
        room.setMaxPlayers(10);
        room.setSongCount(4);
        room.setStatus(RoomStatus.WAITING);

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

      RoomPlayer player=new RoomPlayer();
      player.setRoomId(room.getId());
      player.setUserId(userUUID);
      player.setScore(0);

      roomPlayerRepository.save(player);

    }
}
