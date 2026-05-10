package com.eventhub.event.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public class EventDto {
    
    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer maxCapacity;
    private Integer currentCapacity;
    private BigDecimal price;
    private String imageUrl;
    private String category;
    private String status;
    private Long organizerId;
    private String organizerName;
    private String organizerEmail;
    private Set<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer availableSpots;
    private Boolean available;

    public EventDto() {}

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

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

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

    public Integer getAvailableSpots() { return availableSpots; }
    public void setAvailableSpots(Integer availableSpots) { this.availableSpots = availableSpots; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
}
