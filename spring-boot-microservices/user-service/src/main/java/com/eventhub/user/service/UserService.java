package com.eventhub.user.service;

import com.eventhub.user.dto.LoginRequest;
import com.eventhub.user.dto.RegisterRequest;
import com.eventhub.user.dto.UserDto;
import com.eventhub.user.entity.User;
import com.eventhub.user.repository.UserRepository;
import com.eventhub.user.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public UserDto registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole(User.Role.USER);

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    public String authenticateUser(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(
            loginRequest.getUsername(), loginRequest.getUsername());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        return jwtUtil.generateToken(user);
    }

    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id)
            .map(this::convertToDto);
    }

    public Optional<UserDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .map(this::convertToDto);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setAvatar(userDto.getAvatar());

        if (userDto.getRole() != null) {
            user.setRole(User.Role.valueOf(userDto.getRole()));
        }

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public void changeUserRole(Long id, User.Role newRole) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole(newRole);
        userRepository.save(user);
    }

    public void enableDisableUser(Long id, boolean enabled) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAvatar(user.getAvatar());
        dto.setRole(user.getRole().name());
        dto.setEnabled(user.getEnabled());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
