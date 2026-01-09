package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.entity.RoomStatus;
import com.mayybeabhi.haadu.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class RoomServiceImpl implements RoomService{
    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository){
        this.roomRepository=roomRepository;
    }

    @Override
    public Room createRoom(String adminUserId){

        Room room = new Room();

        room.setRoomCode(generateRoomCode());
        room.setAdminUserId(UUID.fromString(adminUserId));
        room.setMaxPlayers(10);
        room.setSongCount(4);
        room.setStatus(RoomStatus.WAITING);

        return roomRepository.save(room);
    }

    @Override
    public Room getRoomByCode(String roomCode){
        return roomRepository.findByRoomCode(roomCode).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    private String generateRoomCode(){
        return UUID.randomUUID().toString().substring(0,5).toUpperCase();
    }
}
