package com.mayybeabhi.haadu.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "rounds",uniqueConstraints = @UniqueConstraint(columnNames = {"room_id", "round_number"}))
public class Round {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID roomId;

    @Column
    private UUID songSubmissionId;

    @Column(nullable = false)
    private int roundNumber;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false)
    private RoundStatus status;

    @Column(nullable = false)
    private Instant startedAt;

    @Column
    private Instant endedAt;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate(){
        this.createdAt=Instant.now();
    }
}
