package com.mayybeabhi.haadu.exception;

public class GameAlreadyStartedException extends RuntimeException {
    public GameAlreadyStartedException(String message) {
        super(message);
    }
}
