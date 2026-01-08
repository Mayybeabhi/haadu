package com.mayybeabhi.haadu.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(nullable = false)
    private boolean isGuest=true;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    protected  void onCreate(){
        this.createdAt=Instant.now();
    }
}
