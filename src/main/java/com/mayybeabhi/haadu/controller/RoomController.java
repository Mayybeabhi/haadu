package com.mayybeabhi.haadu.controller;

import com.mayybeabhi.haadu.dto.CreateRoomRequest;
import com.mayybeabhi.haadu.dto.JoinRoomRequest;
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
    public Room createRoom(@RequestBody CreateRoomRequest request){
        return roomService.createRoom(request.getAdminUserId());
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
}
