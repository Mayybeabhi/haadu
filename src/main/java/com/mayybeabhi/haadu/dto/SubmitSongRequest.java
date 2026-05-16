package com.mayybeabhi.haadu.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmitSongRequest {
    private UUID id;
    @NotBlank(message = "Youtube URL is required")
    private String youtubeUrl;
}
