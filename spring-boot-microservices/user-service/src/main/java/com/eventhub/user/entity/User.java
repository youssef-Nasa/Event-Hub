package com.eventhub.user.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true)
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    private String avatar;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;
    
    @Column(nullable = false)
    private Boolean enabled = true;
    
    @Column(nullable = false)
    private Boolean accountNonExpired = true;
    
    @Column(nullable = false)
    private Boolean accountNonLocked = true;
    
    @Column(nullable = false)
    private Boolean credentialsNonExpired = true;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_events",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    private Set<Long> registeredEvents = new HashSet<>();

    public enum Role {
        ADMIN, EMPLOYEE, USER
    }

    // Constructors
    public User() {}

    public User(String username, String email, String password, String firstName, String lastName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }

    public Boolean getAccountNonExpired() { return accountNonExpired; }
    public void setAccountNonExpired(Boolean accountNonExpired) { this.accountNonExpired = accountNonExpired; }

    public Boolean getAccountNonLocked() { return accountNonLocked; }
    public void setAccountNonLocked(Boolean accountNonLocked) { this.accountNonLocked = accountNonLocked; }

    public Boolean getCredentialsNonExpired() { return credentialsNonExpired; }
    public void setCredentialsNonExpired(Boolean credentialsNonExpired) { this.credentialsNonExpired = credentialsNonExpired; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Set<Long> getRegisteredEvents() { return registeredEvents; }
    public void setRegisteredEvents(Set<Long> registeredEvents) { this.registeredEvents = registeredEvents; }
}
