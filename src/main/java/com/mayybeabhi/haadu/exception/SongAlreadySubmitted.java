package com.mayybeabhi.haadu.exception;

public class SongAlreadySubmitted extends RuntimeException {
    public SongAlreadySubmitted(String message) {
        super(message);
    }
}
