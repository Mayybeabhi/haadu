package com.mayybeabhi.haadu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateGuestUserRequest {
    @NotBlank(message = "Username is required")

    @Size(min = 2, max = 20, message = "Username must be between 2 and 20 characters")
    private String username;
}
