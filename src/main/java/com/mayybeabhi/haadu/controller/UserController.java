package com.mayybeabhi.haadu.controller;

import com.mayybeabhi.haadu.dto.CreateGuestUserRequest;
import com.mayybeabhi.haadu.dto.auth.AuthResponse;
import com.mayybeabhi.haadu.entity.User;
import com.mayybeabhi.haadu.security.JwtService;
import com.mayybeabhi.haadu.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService,JwtService jwtService){

        this.userService=userService;
        this.jwtService=jwtService;
    }

    @PostMapping("/guest")
    public AuthResponse createGuest(@RequestBody CreateGuestUserRequest request){
        User user= userService.createGuestUser(request.getUsername());
        String token = jwtService.generateToken(user.getId());

        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                token
        );
    }


}
