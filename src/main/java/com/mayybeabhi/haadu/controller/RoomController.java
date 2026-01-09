package com.mayybeabhi.haadu.controller;

import com.mayybeabhi.haadu.dto.CreateRoomRequest;
import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.service.RoomService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private RoomService roomService;
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
}
