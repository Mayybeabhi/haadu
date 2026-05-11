package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.dto.RoomPlayerResponse;
import com.mayybeabhi.haadu.dto.UpdateRoomSettingsRequest;
import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.dto.GameStateResponse;

import java.util.List;
import java.util.UUID;

public interface RoomService {
    Room createRoom(UUID adminUserId);
    Room getRoomByCode(String roomCode);
    Room joinRoom(String roomCode,UUID userId);
    Room updateRoomSettings(String roonCode, UpdateRoomSettingsRequest request);
    void startGame(String roomCode,UUID adminUserId);
    void startRound(String roomCode, UUID adminUserId);
    void endRound(String roomCode, UUID adminUserId, String roundId);
    void endGame(String roomCode, UUID adminUserId);
    List<RoomPlayerResponse> getPlayers(String roomCode);
    GameStateResponse getRoomState(String roomCode);
}
