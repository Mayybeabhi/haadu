package com.mayybeabhi.haadu.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GuessCellResponse {

    private String guessedUsername;

    private Boolean correct;
}