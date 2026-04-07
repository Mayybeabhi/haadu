package com.mayybeabhi.haadu.repository;

import com.mayybeabhi.haadu.entity.Room;
import com.mayybeabhi.haadu.entity.Round;
import com.mayybeabhi.haadu.entity.RoundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoundRepository extends JpaRepository<Round, UUID> {
     boolean existsByRoomIdAndStatus(UUID roomId, RoundStatus status);
     long countByRoomId(UUID roomId);
     List<Round> findByRoomId(UUID roomId);
     Optional<Round> findTopByRoomIdOrderByRoundNumberDesc(UUID roomId);
     Optional<Round> findByRoomIdAndStatus(UUID roomId, RoundStatus status);
     List<Round> findByRoomIdOrderByRoundNumberAsc(UUID roomId);
}
