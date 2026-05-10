package com.eventhub.event.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
@EntityListeners(AuditingEntityListener.class)
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Event title is required")
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotBlank(message = "Event location is required")
    @Column(nullable = false)
    private String location;
    
    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    @Column(nullable = false)
    private LocalDateTime eventDate;
    
    @NotNull(message = "Start time is required")
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @NotNull(message = "End time is required")
    @Column(nullable = false)
    private LocalDateTime endTime;
    
    @NotNull(message = "Maximum capacity is required")
    @Positive(message = "Maximum capacity must be positive")
    @Column(nullable = false)
    private Integer maxCapacity;
    
    @Column(nullable = false)
    private Integer currentCapacity = 0;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.DRAFT;
    
    @Column(name = "organizer_id", nullable = false)
    private Long organizerId;
    
    @Column(name = "organizer_name")
    private String organizerName;
    
    @Column(name = "organizer_email")
    private String organizerEmail;
    
    @ElementCollection
    @CollectionTable(name = "event_tags", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "event_attendees",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<Long> attendeeIds = new HashSet<>();

    public enum EventCategory {
        CONFERENCE, WORKSHOP, SEMINAR, CONCERT, SPORTS, SOCIAL, EDUCATIONAL, ENTERTAINMENT, OTHER
    }

    public enum EventStatus {
        DRAFT, PUBLISHED, CANCELLED, COMPLETED, ONGOING
    }

    // Constructors
    public Event() {}

    public Event(String title, String description, String location, LocalDateTime eventDate, 
                 LocalDateTime startTime, LocalDateTime endTime, Integer maxCapacity, 
                 BigDecimal price, EventCategory category, Long organizerId) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.maxCapacity = maxCapacity;
        this.price = price;
        this.category = category;
        this.organizerId = organizerId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public Integer getCurrentCapacity() { return currentCapacity; }
    public void setCurrentCapacity(Integer currentCapacity) { this.currentCapacity = currentCapacity; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public EventCategory getCategory() { return category; }
    public void setCategory(EventCategory category) { this.category = category; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public String getOrganizerEmail() { return organizerEmail; }
    public void setOrganizerEmail(String organizerEmail) { this.organizerEmail = organizerEmail; }

    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Set<Long> getAttendeeIds() { return attendeeIds; }
    public void setAttendeeIds(Set<Long> attendeeIds) { this.attendeeIds = attendeeIds; }

    // Utility methods
    public boolean isAvailable() {
        return currentCapacity < maxCapacity && status == EventStatus.PUBLISHED;
    }

    public int getAvailableSpots() {
        return maxCapacity - currentCapacity;
    }

    public void addAttendee(Long userId) {
        if (isAvailable()) {
            attendeeIds.add(userId);
            currentCapacity++;
        }
    }

    public void removeAttendee(Long userId) {
        if (attendeeIds.remove(userId)) {
            currentCapacity--;
        }
    }
}
