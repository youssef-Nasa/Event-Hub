package com.eventhub.user.controller;

import com.eventhub.user.dto.LoginRequest;
import com.eventhub.user.dto.RegisterRequest;
import com.eventhub.user.dto.UserDto;
import com.eventhub.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<UserDto> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        UserDto userDto = userService.registerUser(registerRequest);
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Authentication successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<String> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        String token = userService.authenticateUser(loginRequest);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid token")
    })
    public ResponseEntity<String> refreshToken(@RequestHeader("Authorization") String token) {
        // Remove "Bearer " prefix
        String jwtToken = token.substring(7);
        // In a real implementation, you would validate the token and generate a new one
        // For now, we'll just return the same token
        return ResponseEntity.ok(jwtToken);
    }
}
