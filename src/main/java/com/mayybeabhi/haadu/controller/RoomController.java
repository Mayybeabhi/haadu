package com.mayybeabhi.haadu.controller;

import com.mayybeabhi.haadu.dto.*;
import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;
    public RoomController(RoomService roomService){
        this.roomService=roomService;
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody CreateRoomRequest request){
         roomService.createRoom(request.getAdminUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{roomCode}")
    public Room getRoomByCode(@PathVariable String roomCode){
        return roomService.getRoomByCode(roomCode);
    }

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<?> joinRoom(@PathVariable String roomCode,@RequestBody JoinRoomRequest request){
         roomService.joinRoom(roomCode, request.getUserId());
         return ResponseEntity.ok().build();
    }

    @PostMapping("/{roomCode}/settings")
    public ResponseEntity<?> updateRoomSettings(@PathVariable String roomCode,@RequestBody UpdateRoomSettingsRequest request){
             roomService.updateRoomSettings(roomCode,request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{roomCode}/start")
    public ResponseEntity<?> startGame(@PathVariable String roomCode, @RequestBody StartGameRequest request){
        roomService.startGame(roomCode, request.getAdminUserId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("{roomCode}/rounds/start")
    public ResponseEntity<?> startRound(@PathVariable String roomCode, @RequestBody StartRoundRequest request){
        roomService.startRound(roomCode, request.getAdminUserId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("{roomCode}/rounds/{roundId}/end")
    public ResponseEntity<?> endRound(@PathVariable String roomCode,@PathVariable String roundId, @RequestBody EndRoundRequest request){
        roomService.endRound(roomCode, request.getAdminUserId(), roundId);
        return ResponseEntity.ok().build();
    }



}
