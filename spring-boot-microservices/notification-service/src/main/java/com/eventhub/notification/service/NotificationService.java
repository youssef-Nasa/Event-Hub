package com.eventhub.notification.service;

import com.eventhub.notification.dto.NotificationDto;
import com.eventhub.notification.entity.Notification;
import com.eventhub.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public NotificationDto createNotification(Long userId, String title, String message, 
                                            Notification.NotificationType type) {
        Notification notification = new Notification(userId, title, message, type);
        Notification savedNotification = notificationRepository.save(notification);
        
        // Send email asynchronously for important notifications
        if (shouldSendEmail(type)) {
            sendEmailNotificationAsync(savedNotification);
        }
        
        return convertToDto(savedNotification);
    }

    public Optional<NotificationDto> getNotificationById(Long id) {
        return notificationRepository.findById(id)
            .map(this::convertToDto);
    }

    public Page<NotificationDto> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserId(userId, pageable)
            .map(this::convertToDto);
    }

    public Page<NotificationDto> getUserNotificationsByStatus(Long userId, 
                                                             Notification.NotificationStatus status, 
                                                             Pageable pageable) {
        return notificationRepository.findByUserIdAndStatus(userId, status, pageable)
            .map(this::convertToDto);
    }

    public List<NotificationDto> getRecentNotifications(Long userId) {
        return notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadNotifications(userId);
    }

    public NotificationDto markAsRead(Long id, Long userId) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        notification.setStatus(Notification.NotificationStatus.READ);
        Notification updatedNotification = notificationRepository.save(notification);
        return convertToDto(updatedNotification);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository
            .findByUserIdAndStatus(userId, Notification.NotificationStatus.UNREAD, PageRequest.of(0, 1000))
            .getContent();

        unreadNotifications.forEach(n -> n.setStatus(Notification.NotificationStatus.READ));
        notificationRepository.saveAll(unreadNotifications);
    }

    public NotificationDto archiveNotification(Long id, Long userId) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        notification.setStatus(Notification.NotificationStatus.ARCHIVED);
        Notification updatedNotification = notificationRepository.save(notification);
        return convertToDto(updatedNotification);
    }

    public void deleteNotification(Long id, Long userId) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        notificationRepository.deleteById(id);
    }

    public void createEventRegistrationNotification(Long userId, String eventTitle, Long eventId) {
        String title = "Event Registration Successful";
        String message = String.format("You have successfully registered for the event: %s", eventTitle);
        NotificationDto notification = createNotification(userId, title, message, Notification.NotificationType.EVENT_REGISTRATION);
        
        // Set related entity information
        Notification entity = notificationRepository.findById(notification.getId()).get();
        entity.setRelatedEntityId(eventId);
        entity.setRelatedEntityType("EVENT");
        notificationRepository.save(entity);
    }

    public void createEventReminderNotification(Long userId, String eventTitle, Long eventId) {
        String title = "Event Reminder";
        String message = String.format("Reminder: You have an upcoming event '%s' tomorrow.", eventTitle);
        NotificationDto notification = createNotification(userId, title, message, Notification.NotificationType.EVENT_REMINDER);
        
        // Set related entity information
        Notification entity = notificationRepository.findById(notification.getId()).get();
        entity.setRelatedEntityId(eventId);
        entity.setRelatedEntityType("EVENT");
        notificationRepository.save(entity);
    }

    public void createEventCancellationNotification(Long userId, String eventTitle, Long eventId) {
        String title = "Event Cancelled";
        String message = String.format("The event '%s' has been cancelled. You will receive a refund if applicable.", eventTitle);
        NotificationDto notification = createNotification(userId, title, message, Notification.NotificationType.EVENT_CANCELLATION);
        
        // Set related entity information
        Notification entity = notificationRepository.findById(notification.getId()).get();
        entity.setRelatedEntityId(eventId);
        entity.setRelatedEntityType("EVENT");
        notificationRepository.save(entity);
    }

    @Async
    public void sendEmailNotificationAsync(Notification notification) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromEmail);
            mailMessage.setTo(getUserEmail(notification.getUserId()));
            mailMessage.setSubject(notification.getTitle());
            mailMessage.setText(notification.getMessage());

            mailSender.send(mailMessage);

            // Mark as sent via email
            notification.setSentViaEmail(true);
            notification.setEmailSentAt(LocalDateTime.now());
            notificationRepository.save(notification);

        } catch (Exception e) {
            // Log error but don't fail the notification creation
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }

    private boolean shouldSendEmail(Notification.NotificationType type) {
        return type == Notification.NotificationType.EVENT_REGISTRATION ||
               type == Notification.NotificationType.EVENT_REMINDER ||
               type == Notification.NotificationType.EVENT_CANCELLATION ||
               type == Notification.NotificationType.PAYMENT_CONFIRMATION;
    }

    private String getUserEmail(Long userId) {
        // In a real implementation, you would call the user service to get the email
        // For now, return a placeholder
        return "user" + userId + "@example.com";
    }

    private NotificationDto convertToDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUserId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType().name());
        dto.setStatus(notification.getStatus().name());
        dto.setRelatedEntityId(notification.getRelatedEntityId());
        dto.setRelatedEntityType(notification.getRelatedEntityType());
        dto.setSentViaEmail(notification.getSentViaEmail());
        dto.setEmailSentAt(notification.getEmailSentAt());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
