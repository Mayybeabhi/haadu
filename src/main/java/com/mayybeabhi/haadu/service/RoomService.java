package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.entity.Room;

import java.util.UUID;

public interface RoomService {
    Room createRoom(String adminUserId);
    Room getRoomByCode(String roomCode);
}
