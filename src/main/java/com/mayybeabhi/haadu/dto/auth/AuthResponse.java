package com.mayybeabhi.haadu.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponse {

    private UUID id;

    private String username;

    private String token;
}