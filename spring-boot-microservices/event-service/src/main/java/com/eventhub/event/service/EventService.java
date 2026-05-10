package com.eventhub.event.service;

import com.eventhub.event.dto.EventDto;
import com.eventhub.event.dto.EventSearchRequest;
import com.eventhub.event.entity.Event;
import com.eventhub.event.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public EventDto createEvent(EventDto eventDto, Long organizerId) {
        Event event = convertToEntity(eventDto);
        event.setOrganizerId(organizerId);
        event.setStatus(Event.EventStatus.DRAFT);
        
        Event savedEvent = eventRepository.save(event);
        return convertToDto(savedEvent);
    }

    public Optional<EventDto> getEventById(Long id) {
        return eventRepository.findById(id)
            .map(this::convertToDto);
    }

    public Page<EventDto> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable)
            .map(this::convertToDto);
    }

    public Page<EventDto> getPublishedEvents(Pageable pageable) {
        return eventRepository.findByStatus(Event.EventStatus.PUBLISHED, pageable)
            .map(this::convertToDto);
    }

    public Page<EventDto> searchEvents(EventSearchRequest searchRequest) {
        Pageable pageable = PageRequest.of(
            searchRequest.getPage(),
            searchRequest.getSize(),
            Sort.by(searchRequest.getSortBy()).ascending()
        );

        Page<Event> events;

        if (searchRequest.getKeyword() != null && !searchRequest.getKeyword().trim().isEmpty()) {
            events = eventRepository.findByKeyword(searchRequest.getKeyword(), pageable);
        } else if (searchRequest.getCategory() != null) {
            events = eventRepository.findByCategory(Event.EventCategory.valueOf(searchRequest.getCategory()), pageable);
        } else if (searchRequest.getStartDate() != null && searchRequest.getEndDate() != null) {
            events = eventRepository.findByEventDateBetween(searchRequest.getStartDate(), searchRequest.getEndDate(), pageable);
        } else if (searchRequest.getMinPrice() != null && searchRequest.getMaxPrice() != null) {
            events = eventRepository.findByPriceRange(searchRequest.getMinPrice(), searchRequest.getMaxPrice(), pageable);
        } else {
            events = eventRepository.findByStatusAndEventDateAfter(
                Event.EventStatus.PUBLISHED, LocalDateTime.now(), pageable);
        }

        return events.map(this::convertToDto);
    }

    public EventDto updateEvent(Long id, EventDto eventDto, Long organizerId) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("You are not authorized to update this event");
        }

        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setLocation(eventDto.getLocation());
        event.setEventDate(eventDto.getEventDate());
        event.setStartTime(eventDto.getStartTime());
        event.setEndTime(eventDto.getEndTime());
        event.setMaxCapacity(eventDto.getMaxCapacity());
        event.setPrice(eventDto.getPrice());
        event.setImageUrl(eventDto.getImageUrl());
        event.setCategory(Event.EventCategory.valueOf(eventDto.getCategory()));
        event.setTags(eventDto.getTags());

        Event updatedEvent = eventRepository.save(event);
        return convertToDto(updatedEvent);
    }

    public void deleteEvent(Long id, Long organizerId) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("You are not authorized to delete this event");
        }

        eventRepository.deleteById(id);
    }

    public EventDto publishEvent(Long id, Long organizerId) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("You are not authorized to publish this event");
        }

        event.setStatus(Event.EventStatus.PUBLISHED);
        Event publishedEvent = eventRepository.save(event);
        return convertToDto(publishedEvent);
    }

    public EventDto cancelEvent(Long id, Long organizerId) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("You are not authorized to cancel this event");
        }

        event.setStatus(Event.EventStatus.CANCELLED);
        Event cancelledEvent = eventRepository.save(event);
        return convertToDto(cancelledEvent);
    }

    public EventDto registerForEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.isAvailable()) {
            throw new RuntimeException("Event is not available for registration");
        }

        if (event.getAttendeeIds().contains(userId)) {
            throw new RuntimeException("User is already registered for this event");
        }

        event.addAttendee(userId);
        Event updatedEvent = eventRepository.save(event);
        return convertToDto(updatedEvent);
    }

    public EventDto unregisterFromEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        event.removeAttendee(userId);
        Event updatedEvent = eventRepository.save(event);
        return convertToDto(updatedEvent);
    }

    public Page<EventDto> getEventsByOrganizer(Long organizerId, Pageable pageable) {
        return eventRepository.findByOrganizerId(organizerId, pageable)
            .map(this::convertToDto);
    }

    public List<EventDto> getUpcomingEvents() {
        return eventRepository.findTop10ByStatusOrderByEventDateAsc(Event.EventStatus.PUBLISHED)
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    private EventDto convertToDto(Event event) {
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setEventDate(event.getEventDate());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setMaxCapacity(event.getMaxCapacity());
        dto.setCurrentCapacity(event.getCurrentCapacity());
        dto.setPrice(event.getPrice());
        dto.setImageUrl(event.getImageUrl());
        dto.setCategory(event.getCategory().name());
        dto.setStatus(event.getStatus().name());
        dto.setOrganizerId(event.getOrganizerId());
        dto.setOrganizerName(event.getOrganizerName());
        dto.setOrganizerEmail(event.getOrganizerEmail());
        dto.setTags(event.getTags());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        dto.setAvailableSpots(event.getAvailableSpots());
        dto.setAvailable(event.isAvailable());
        return dto;
    }

    private Event convertToEntity(EventDto dto) {
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setLocation(dto.getLocation());
        event.setEventDate(dto.getEventDate());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setMaxCapacity(dto.getMaxCapacity());
        event.setCurrentCapacity(dto.getCurrentCapacity());
        event.setPrice(dto.getPrice());
        event.setImageUrl(dto.getImageUrl());
        if (dto.getCategory() != null) {
            event.setCategory(Event.EventCategory.valueOf(dto.getCategory()));
        }
        if (dto.getStatus() != null) {
            event.setStatus(Event.EventStatus.valueOf(dto.getStatus()));
        }
        event.setOrganizerId(dto.getOrganizerId());
        event.setOrganizerName(dto.getOrganizerName());
        event.setOrganizerEmail(dto.getOrganizerEmail());
        event.setTags(dto.getTags());
        return event;
    }
}
