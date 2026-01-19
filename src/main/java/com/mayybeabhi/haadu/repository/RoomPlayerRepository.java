package com.mayybeabhi.haadu.repository;

import com.mayybeabhi.haadu.entity.RoomPlayer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RoomPlayerRepository extends JpaRepository<RoomPlayer, UUID> {

    long countByRoomId(UUID roomId);
    boolean existsByRoomIdAndUserId(UUID roomId,UUID userId);
    List<RoomPlayer> findByRoomId(UUID roomId);
}
