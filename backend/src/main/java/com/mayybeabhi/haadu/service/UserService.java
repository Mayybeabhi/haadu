package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.entity.User;
import java.util.Optional;

public interface UserService {

    User createGuestUser(String username);

    Optional<User> findByUsername(String username);
}
