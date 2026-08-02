package com.petshop.backend.auth.service;

import com.petshop.backend.auth.dto.LoginRequest;
import com.petshop.backend.auth.dto.LoginResponse;
import com.petshop.backend.auth.dto.RegisterRequest;
import com.petshop.backend.auth.dto.RegisterResponse;
import com.petshop.backend.auth.entity.Role;
import com.petshop.backend.auth.entity.User;
import com.petshop.backend.auth.repository.RoleRepository;
import com.petshop.backend.auth.repository.UserRepository;
import com.petshop.backend.security.jwt.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists.");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found."));

        User user = new User();

        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        RegisterResponse response = new RegisterResponse();

        response.setId(savedUser.getId());
        response.setFullName(savedUser.getFullName());
        response.setUsername(savedUser.getUsername());
        response.setRole(savedUser.getRole().getName());
        response.setMessage("User registered successfully.");

        return response;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }

        String token = jwtService.generateToken(user.getUsername());

        LoginResponse response = new LoginResponse();

        response.setToken(token);
        response.setUsername(user.getUsername());
        response.setRole(user.getRole().getName());
        response.setMessage("Login successful.");

        return response;
    }
}