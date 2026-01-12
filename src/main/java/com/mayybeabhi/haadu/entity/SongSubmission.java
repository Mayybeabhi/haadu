package com.mayybeabhi.haadu.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "song_submissions",uniqueConstraints = @UniqueConstraint(columnNames = {"room_id","user_id","youtube_url"}))
public class SongSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID roomId;

    @Column(nullable = false)
    private UUID userId;

    @Column
    private String youtubeUrl;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate(){
        this.createdAt=Instant.now();
    }
}
