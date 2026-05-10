package com.eventhub.event.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;

public class EventSearchRequest {
    
    private String keyword;
    private String category;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Double minPrice;
    private Double maxPrice;
    
    @Min(value = 0, message = "Page must be 0 or greater")
    private int page = 0;
    
    @Min(value = 1, message = "Size must be 1 or greater")
    @Max(value = 100, message = "Size must be 100 or less")
    private int size = 10;
    
    private String sortBy = "eventDate";

    public EventSearchRequest() {}

    // Getters and Setters
    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Double getMinPrice() { return minPrice; }
    public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }

    public Double getMaxPrice() { return maxPrice; }
    public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }
}
