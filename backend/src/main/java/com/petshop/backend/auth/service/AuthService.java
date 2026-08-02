package com.petshop.backend.auth.service;

import com.petshop.backend.auth.dto.LoginRequest;
import com.petshop.backend.auth.dto.LoginResponse;
import com.petshop.backend.auth.dto.RegisterRequest;
import com.petshop.backend.auth.dto.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

}