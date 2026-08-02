package com.petshop.backend.auth.controller;

import com.petshop.backend.auth.dto.LoginRequest;
import com.petshop.backend.auth.dto.LoginResponse;
import com.petshop.backend.auth.dto.RegisterRequest;
import com.petshop.backend.auth.dto.RegisterResponse;
import com.petshop.backend.auth.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}