package com.mayybeabhi.haadu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongSubmissionResponse {

    private UUID id;

    private UUID userId;

    private String youtubeUrl;
}
