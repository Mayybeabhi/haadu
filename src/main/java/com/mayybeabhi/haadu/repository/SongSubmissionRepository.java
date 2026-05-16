package com.mayybeabhi.haadu.repository;

import com.mayybeabhi.haadu.entity.SongSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SongSubmissionRepository extends JpaRepository<SongSubmission, UUID> {

    boolean existsByRoomIdAndUserIdAndYoutubeUrl(UUID roomId,UUID userId,String youtubeUrl);
    long countByRoomIdAndUserId(UUID roomId,UUID userId);
    long countByRoomId(UUID roomId);
    @Query("""
    SELECT s
    FROM SongSubmission s
    WHERE s.roomId = :roomId
      AND s.id NOT IN (
          SELECT r.songSubmissionId
          FROM Round r
          WHERE r.roomId = :roomId
      )
""") List<SongSubmission> findUnusedSongsByRoomId(UUID roomId);
    List<SongSubmission> findByRoomIdAndUserIdOrderByCreatedAtAsc(UUID roomId,UUID userId);
    List<SongSubmission> findByRoomId(UUID roomId);
    
}
