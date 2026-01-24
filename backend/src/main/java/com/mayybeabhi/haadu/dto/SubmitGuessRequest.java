package com.mayybeabhi.haadu.dto;

import lombok.Data;

@Data
public class SubmitGuessRequest {
    private String guessingUserId;
    private String guessedUserId;
}
