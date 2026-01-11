package com.mayybeabhi.haadu.service;

import com.mayybeabhi.haadu.exception.UsernameAlreadyExistsException;
import com.mayybeabhi.haadu.service.UserService;
import com.mayybeabhi.haadu.entity.User;
import com.mayybeabhi.haadu.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    @Override
    public User createGuestUser(String username){

        userRepository.findByUsername(username).ifPresent(u ->{
            throw new UsernameAlreadyExistsException("Username already exists");
        });

        User user = new User();
        user.setUsername(username);
        return userRepository.save(user);

    };

    @Override
    public Optional<User> findByUsername(String username){
        return userRepository.findByUsername(username);

    }
}
