package com.mayybeabhi.haadu.repository;

import com.mayybeabhi.haadu.entity.RoomPlayer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RoomPlayerRepository extends JpaRepository<RoomPlayer, UUID> {

    long countByRoomId(UUID roomId);
    boolean existsByRoomIdAndUserId(UUID roomId,UUID userId);
}
