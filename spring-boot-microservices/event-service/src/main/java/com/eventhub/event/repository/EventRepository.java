package com.eventhub.event.repository;

import com.eventhub.event.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    Page<Event> findByStatus(Event.EventStatus status, Pageable pageable);
    
    Page<Event> findByCategory(Event.EventCategory category, Pageable pageable);
    
    Page<Event> findByOrganizerId(Long organizerId, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.status = :status AND e.eventDate >= :startDate")
    Page<Event> findByStatusAndEventDateAfter(@Param("status") Event.EventStatus status, 
                                             @Param("startDate") LocalDateTime startDate, 
                                             Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.title LIKE %:keyword% OR e.description LIKE %:keyword% OR e.location LIKE %:keyword%")
    Page<Event> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate BETWEEN :startDate AND :endDate")
    Page<Event> findByEventDateBetween(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate, 
                                       Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.price BETWEEN :minPrice AND :maxPrice")
    Page<Event> findByPriceRange(@Param("minPrice") Double minPrice, 
                                 @Param("maxPrice") Double maxPrice, 
                                 Pageable pageable);
    
    @Query("SELECT e FROM Event e JOIN e.tags t WHERE t IN :tags")
    Page<Event> findByTags(@Param("tags") List<String> tags, Pageable pageable);
    
    List<Event> findTop10ByStatusOrderByEventDateAsc(Event.EventStatus status);
    
    List<Event> findByOrganizerIdAndStatus(Long organizerId, Event.EventStatus status);
    
    @Query("SELECT COUNT(e) FROM Event e WHERE e.organizerId = :organizerId AND e.status = :status")
    long countByOrganizerIdAndStatus(@Param("organizerId") Long organizerId, 
                                    @Param("status") Event.EventStatus status);
    
    boolean existsByTitleAndEventDate(String title, LocalDateTime eventDate);
}
