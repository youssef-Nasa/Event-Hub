package com.eventhub.notification.controller;

import com.eventhub.notification.dto.NotificationDto;
import com.eventhub.notification.entity.Notification;
import com.eventhub.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notification Management", description = "Notification management APIs")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Operation(summary = "Create a new notification")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Notification created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<NotificationDto> createNotification(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String message,
            @RequestParam Notification.NotificationType type) {
        
        NotificationDto notification = notificationService.createNotification(userId, title, message, type);
        return new ResponseEntity<>(notification, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @notificationSecurity.isOwner(#id, authentication.name)")
    @Operation(summary = "Get notification by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notification retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Notification not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<NotificationDto> getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or @notificationSecurity.isOwner(#userId, authentication.name)")
    @Operation(summary = "Get user notifications")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Page<NotificationDto>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationDto> notifications = notificationService.getUserNotifications(userId, pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or @notificationSecurity.isOwner(#userId, authentication.name)")
    @Operation(summary = "Get user notifications by status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Page<NotificationDto>> getUserNotificationsByStatus(
            @PathVariable Long userId,
            @PathVariable Notification.NotificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationDto> notifications = notificationService.getUserNotificationsByStatus(userId, status, pageable);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/recent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or @notificationSecurity.isOwner(#userId, authentication.name)")
    @Operation(summary = "Get recent notifications for user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Recent notifications retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<List<NotificationDto>> getRecentNotifications(@PathVariable Long userId) {
        List<NotificationDto> notifications = notificationService.getRecentNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/unread-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or @notificationSecurity.isOwner(#userId, authentication.name)")
    @Operation(summary = "Get unread notifications count for user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Unread count retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN') or @notificationSecurity.isOwner(#id, authentication.name)")
    @Operation(summary = "Mark notification as read")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notification marked as read"),
        @ApiResponse(responseCode = "404", description = "Notification not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<NotificationDto> markAsRead(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        
        NotificationDto notification = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/user/{userId}/read-all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or @notificationSecurity.isOwner(#userId, authentication.name)")
    @Operation(summary = "Mark all notifications as read for user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "All notifications marked as read"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/archive")
    @PreAuthorize("hasRole('ADMIN') or @notificationSecurity.isOwner(#id, authentication.name)")
    @Operation(summary = "Archive notification")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notification archived"),
        @ApiResponse(responseCode = "404", description = "Notification not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<NotificationDto> archiveNotification(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        
        NotificationDto notification = notificationService.archiveNotification(id, userId);
        return ResponseEntity.ok(notification);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @notificationSecurity.isOwner(#id, authentication.name)")
    @Operation(summary = "Delete notification")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Notification deleted"),
        @ApiResponse(responseCode = "404", description = "Notification not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.noContent().build();
    }

    // Event-specific notification endpoints
    @PostMapping("/event-registration")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Operation(summary = "Create event registration notification")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Event registration notification created"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<NotificationDto> createEventRegistrationNotification(
            @RequestParam Long userId,
            @RequestParam String eventTitle,
            @RequestParam Long eventId) {
        
        notificationService.createEventRegistrationNotification(userId, eventTitle, eventId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/event-reminder")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Operation(summary = "Create event reminder notification")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Event reminder notification created"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<NotificationDto> createEventReminderNotification(
            @RequestParam Long userId,
            @RequestParam String eventTitle,
            @RequestParam Long eventId) {
        
        notificationService.createEventReminderNotification(userId, eventTitle, eventId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/event-cancellation")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Operation(summary = "Create event cancellation notification")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Event cancellation notification created"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<NotificationDto> createEventCancellationNotification(
            @RequestParam Long userId,
            @RequestParam String eventTitle,
            @RequestParam Long eventId) {
        
        notificationService.createEventCancellationNotification(userId, eventTitle, eventId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
