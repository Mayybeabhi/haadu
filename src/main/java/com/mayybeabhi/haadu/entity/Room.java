package com.mayybeabhi.haadu.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 5)
    private String roomCode;

    @Column(nullable = false)
    private UUID adminUserId;

    @Column(nullable = false)
    private int maxPlayers;

    @Column(nullable = false)
    private int songCount;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false)
    private RoomStatus status;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private boolean isRoundTimerEnabled=true;

    @Column(name = "round_duration_seconds")
    private Integer roundTimer;

    @Column(nullable = false,name = "is_between_round_timer_enabled")
    private boolean isInBetweenRoundTimerEnabled=true;

    @Column(name="between_round_duration_seconds")
    private Integer inBetweenRoundTimer;

    @PrePersist
    protected void onCreate(){
        this.createdAt=Instant.now();
    }
}
