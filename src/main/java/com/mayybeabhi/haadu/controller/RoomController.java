package com.mayybeabhi.haadu.controller;

import com.mayybeabhi.haadu.dto.*;
import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.security.SecurityUtils;
import com.mayybeabhi.haadu.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;
    public RoomController(RoomService roomService){
        this.roomService=roomService;
    }

    @PostMapping
    public ResponseEntity<CreateRoomResponse> createRoom(){
        Room room= roomService.createRoom(SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok( CreateRoomResponse.builder().roomCode(room.getRoomCode()).build());
    }

    @GetMapping("/{roomCode}")
    public Room getRoomByCode(@PathVariable String roomCode){
        return roomService.getRoomByCode(roomCode);
    }

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<RoomCodeResponse> joinRoom(@PathVariable String roomCode){
        Room room= roomService.joinRoom(roomCode, SecurityUtils.getCurrentUserId());
         return ResponseEntity.ok(RoomCodeResponse.builder().roomCode(room.getRoomCode()).build());
    }

    @PostMapping("/{roomCode}/settings")
    public ResponseEntity<?> updateRoomSettings(@PathVariable String roomCode,@Valid @RequestBody UpdateRoomSettingsRequest request){
             roomService.updateRoomSettings(roomCode,request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{roomCode}/start")
    public ResponseEntity<?> startGame(@PathVariable String roomCode){
        roomService.startGame(roomCode, SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{roomCode}/rounds/start")
    public ResponseEntity<?> startRound(@PathVariable String roomCode){
        roomService.startRound(roomCode, SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{roomCode}/rounds/{roundId}/end")
    public ResponseEntity<?> endRound(@PathVariable String roomCode,@PathVariable String roundId){
        roomService.endRound(roomCode, SecurityUtils.getCurrentUserId(), roundId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{roomCode}/end")
    public ResponseEntity<?> endGame(@PathVariable String roomCode) {
        roomService.endGame(roomCode, SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{roomCode}/players")
    public ResponseEntity<List<RoomPlayerResponse>> getPlayers(@PathVariable String roomCode){
        return ResponseEntity.ok(roomService.getPlayers(roomCode));
    }

    @GetMapping("/{roomCode}/state")
    public ResponseEntity<GameStateResponse> getRoomState(@PathVariable String roomCode) {
        return ResponseEntity.ok(roomService.getRoomState(roomCode));
    }

}
