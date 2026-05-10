package com.eventhub.event.controller;

import com.eventhub.event.dto.EventDto;
import com.eventhub.event.dto.EventSearchRequest;
import com.eventhub.event.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Event Management", description = "Event management APIs")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Operation(summary = "Create a new event")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Event created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<EventDto> createEvent(@Valid @RequestBody EventDto eventDto, 
                                             @RequestHeader("X-User-Id") Long userId) {
        EventDto createdEvent = eventService.createEvent(eventDto, userId);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<EventDto> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "Get all events")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Events retrieved successfully")
    })
    public ResponseEntity<Page<EventDto>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "eventDate") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.getAllEvents(pageable);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/published")
    @Operation(summary = "Get published events")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Published events retrieved successfully")
    })
    public ResponseEntity<Page<EventDto>> getPublishedEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "eventDate") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.getPublishedEvents(pageable);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/search")
    @Operation(summary = "Search events")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Search completed successfully")
    })
    public ResponseEntity<Page<EventDto>> searchEvents(@Valid @RequestBody EventSearchRequest searchRequest) {
        Page<EventDto> events = eventService.searchEvents(searchRequest);
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @eventSecurity.isOrganizer(#id, authentication.name)")
    @Operation(summary = "Update event")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event updated successfully"),
        @ApiResponse(responseCode = "404", description = "Event not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<EventDto> updateEvent(@PathVariable Long id, 
                                               @Valid @RequestBody EventDto eventDto,
                                               @RequestHeader("X-User-Id") Long userId) {
        EventDto updatedEvent = eventService.updateEvent(id, eventDto, userId);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @eventSecurity.isOrganizer(#id, authentication.name)")
    @Operation(summary = "Delete event")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Event deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Event not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id,
                                           @RequestHeader("X-User-Id") Long userId) {
        eventService.deleteEvent(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN') or @eventSecurity.isOrganizer(#id, authentication.name)")
    @Operation(summary = "Publish event")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event published successfully"),
        @ApiResponse(responseCode = "404", description = "Event not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<EventDto> publishEvent(@PathVariable Long id,
                                                @RequestHeader("X-User-Id") Long userId) {
        EventDto publishedEvent = eventService.publishEvent(id, userId);
        return ResponseEntity.ok(publishedEvent);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or @eventSecurity.isOrganizer(#id, authentication.name)")
    @Operation(summary = "Cancel event")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event cancelled successfully"),
        @ApiResponse(responseCode = "404", description = "Event not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<EventDto> cancelEvent(@PathVariable Long id,
                                              @RequestHeader("X-User-Id") Long userId) {
        EventDto cancelledEvent = eventService.cancelEvent(id, userId);
        return ResponseEntity.ok(cancelledEvent);
    }

    @PostMapping("/{id}/register")
    @PreAuthorize("hasRole('USER') or hasRole('EMPLOYEE') or hasRole('ADMIN')")
    @Operation(summary = "Register for event")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registration successful"),
        @ApiResponse(responseCode = "404", description = "Event not found"),
        @ApiResponse(responseCode = "400", description = "Registration failed")
    })
    public ResponseEntity<EventDto> registerForEvent(@PathVariable Long id,
                                                    @RequestHeader("X-User-Id") Long userId) {
        EventDto event = eventService.registerForEvent(id, userId);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{id}/register")
    @PreAuthorize("hasRole('USER') or hasRole('EMPLOYEE') or hasRole('ADMIN')")
    @Operation(summary = "Unregister from event")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Unregistration successful"),
        @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<EventDto> unregisterFromEvent(@PathVariable Long id,
                                                       @RequestHeader("X-User-Id") Long userId) {
        EventDto event = eventService.unregisterFromEvent(id, userId);
        return ResponseEntity.ok(event);
    }

    @GetMapping("/organizer/{organizerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or @eventSecurity.isOrganizer(#organizerId, authentication.name)")
    @Operation(summary = "Get events by organizer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Events retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Page<EventDto>> getEventsByOrganizer(@PathVariable Long organizerId,
                                                               @RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.getEventsByOrganizer(organizerId, pageable);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming events")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Upcoming events retrieved successfully")
    })
    public ResponseEntity<?> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }
}
