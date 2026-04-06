package com.mayybeabhi.haadu.dto;

import java.util.UUID;

public record RoomPlayerResponse( UUID userId, String username, boolean isAdmin, long songsSubmitted){
}
