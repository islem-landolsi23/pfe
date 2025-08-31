package com.example.pfe.Entity.DTO;


import com.example.pfe.Entity.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Mapper {



    public ProjectDto toDto(Project project) {
        return new ProjectDto(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStartDate(),
                project.getEndDate(),
                project.getSprints().stream()
                        .map(this::toDto)
                        .toList()
        );
    }

    public SprintDto toDto(Sprint sprint) {
        return new SprintDto(
                sprint.getId(),
                sprint.getName(),
                sprint.getStartDate(),
                sprint.getEndDate(),
                sprint.getStatus(),
                sprint.getProject() != null ? sprint.getProject().getId() : null,
                sprint.getTasks().stream()
                        .map(this::toDto)
                        .toList()
        );
    }

    public TaskDTO toDto(Task task) {
        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getCreatedAt(),
                task.getDueDate(),
                task.getSprint() != null ? task.getSprint().getId() : null,
                task.getAssignedUser() != null ? task.getAssignedUser().getId() : null
        );
    }
    public UserDto toDto(User user) {
        if (user == null) return null;
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatarUrl()
        );
    }


    public ConversationDto toDto(Conversation conversation) {
        List<UserDto> participantDtos = conversation.getParticipants().stream()
                .map(u -> new UserDto(u.getId(), u.getName(), u.getEmail(), u.getAvatarUrl()))
                .collect(Collectors.toList());

        return new ConversationDto(
                conversation.getId(),
                conversation.getTitle(),
                conversation.isGroup(),
                conversation.getCreatedAt(),
                participantDtos
        );
    }

    public  NotificationDTO toDTO(Notification notification) {
        if (notification == null) {
            return null;
        }

        NotificationDTO newDto = new NotificationDTO(
                notification.getTitle(),
                notification.getMessage(),
                notification.getReceiver() != null ? notification.getReceiver().getEmail() : null,
                notification.getTimestamp(),
                notification.getSender() != null ? notification.getSender().getEmail() : null,
                notification.getType(),
                notification.getTaskUrl()
        );

        newDto.setId(notification.getId());
        return newDto ;
    }
}
