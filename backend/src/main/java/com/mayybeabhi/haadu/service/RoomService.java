package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.dto.UpdateRoomSettingsRequest;
import com.mayybeabhi.haadu.entity.Room;

public interface RoomService {
    Room createRoom(String adminUserId);
    Room getRoomByCode(String roomCode);
    void joinRoom(String roomCode,String userId);
    Room updateRoomSettings(String roonCode, UpdateRoomSettingsRequest request);
    void startGame(String roomCode,String adminUserId);
    void startRound(String roomCode, String adminUserId);
    void endRound(String roomCode, String adminUserId, String roundId);
    void endGame(String roomCode, String adminUserId);
}
