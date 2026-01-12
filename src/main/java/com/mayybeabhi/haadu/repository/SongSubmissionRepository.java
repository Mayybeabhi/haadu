package com.mayybeabhi.haadu.repository;

import com.mayybeabhi.haadu.entity.SongSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SongSubmissionRepository extends JpaRepository<SongSubmission, UUID> {

    boolean existsByRoomIdAndUserIdAndYoutubeUrl(UUID roomId,UUID userId,String youtubeUrl);
    long countByRoomIdAndUserId(UUID roomId,UUID userId);

}
