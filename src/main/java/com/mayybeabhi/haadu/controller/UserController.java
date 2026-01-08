package com.mayybeabhi.haadu.controller;

import com.mayybeabhi.haadu.dto.CreateGuestUserRequest;
import com.mayybeabhi.haadu.entity.User;
import com.mayybeabhi.haadu.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService=userService;
    }

    @PostMapping("/guest")
    public User createGuest(@RequestBody CreateGuestUserRequest request){
        return userService.createGuestUser(request.getUsername());
    }

}
