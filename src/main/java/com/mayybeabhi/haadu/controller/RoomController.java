package com.mayybeabhi.haadu.controller;

import com.mayybeabhi.haadu.dto.*;
import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.service.RoomService;
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
    public ResponseEntity<String> createRoom(@RequestBody CreateRoomRequest request){
        Room room= roomService.createRoom(request.getAdminUserId());
        return ResponseEntity.ok(room.getRoomCode());
    }

    @GetMapping("/{roomCode}")
    public Room getRoomByCode(@PathVariable String roomCode){
        return roomService.getRoomByCode(roomCode);
    }

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<String> joinRoom(@PathVariable String roomCode,@RequestBody JoinRoomRequest request){
        Room room= roomService.joinRoom(roomCode, request.getUserId());
         return ResponseEntity.ok(room.getRoomCode());
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

    @PostMapping("/{roomCode}/end")
    public ResponseEntity<?> endGame(
            @PathVariable String roomCode,
            @RequestBody EndGameRequest request
    ) {
        roomService.endGame(roomCode, request.getAdminUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{roomCode}/players")
    public List<RoomPlayerResponse> getPlayers(@PathVariable String roomCode){
        return roomService.getPlayers(roomCode);
    }

    @GetMapping("/{roomCode}/state")
public ResponseEntity<GameStateResponse> getRoomState(@PathVariable String roomCode) {
    return ResponseEntity.ok(roomService.getRoomState(roomCode));
}

}
