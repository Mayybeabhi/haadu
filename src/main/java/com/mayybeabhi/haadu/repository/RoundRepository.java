package com.mayybeabhi.haadu.repository;

import com.mayybeabhi.haadu.entity.Round;
import com.mayybeabhi.haadu.entity.RoundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RoundRepository extends JpaRepository<Round, UUID> {
     boolean existsByRoomIdAndStatus(UUID roomId, RoundStatus status);
     long countByRoomId(UUID roomId);
}
