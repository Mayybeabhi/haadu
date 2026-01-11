package com.mayybeabhi.haadu.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "room_players", uniqueConstraints = {@UniqueConstraint(columnNames = {"room_id","user_id"})})
public class RoomPlayer {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID roomId;

    @Column(nullable = false)
    private  UUID userId;

    @Column(nullable = false)
    private int score=0;

    @Column(nullable = false)
    private Instant joinedAt;

    @PrePersist
    void onCreate(){
        this.joinedAt =Instant.now();
    }

}
