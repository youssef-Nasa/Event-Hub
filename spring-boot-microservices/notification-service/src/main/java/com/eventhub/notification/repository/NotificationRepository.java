package com.eventhub.notification.repository;

import com.eventhub.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByUserId(Long userId, Pageable pageable);
    
    Page<Notification> findByUserIdAndStatus(Long userId, Notification.NotificationStatus status, Pageable pageable);
    
    Page<Notification> findByUserIdAndType(Long userId, Notification.NotificationType type, Pageable pageable);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.status = 'UNREAD'")
    long countUnreadNotifications(@Param("userId") Long userId);
    
    List<Notification> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.createdAt < :beforeDate AND n.status = 'UNREAD'")
    List<Notification> findOldUnreadNotifications(@Param("beforeDate") LocalDateTime beforeDate);
    
    @Query("SELECT n FROM Notification n WHERE n.sentViaEmail = false AND n.type IN :types")
    List<Notification> findNotificationsToSendByEmail(@Param("types") List<Notification.NotificationType> types);
}
