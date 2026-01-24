package com.mayybeabhi.haadu.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "guesses",uniqueConstraints = @UniqueConstraint(columnNames = {"round_id","guessing_user_id"}))
public class Guess {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false)
    UUID roundId;

    @Column(nullable = false)
    UUID guessingUserId;

    @Column(nullable = false)
    UUID guessedUserId;

    @Column(nullable = false)
    Instant createdAt;

    @PrePersist
    void onCreate(){
        this.createdAt= Instant.now();
    }
}
