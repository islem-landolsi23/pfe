package com.example.pfe.Entity.DTO;


import com.example.pfe.Entity.Project;
import com.example.pfe.Entity.Sprint;
import com.example.pfe.Entity.Task;
import com.example.pfe.Entity.User;
import org.springframework.stereotype.Service;

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
}
