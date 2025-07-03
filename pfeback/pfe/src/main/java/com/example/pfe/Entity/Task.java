package com.example.pfe.Entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status; // TO_DO, IN_PROGRESS, DONE

    @Enumerated(EnumType.STRING)
    private TaskType type;     // BUG, FEATURE, STORY, EPIC

    @Enumerated(EnumType.STRING)
    private Priority priority; // LOW, MEDIUM, HIGH, CRITICAL

    @ManyToOne
    private Project project;

    @ManyToOne
    private User assignee;

    @ManyToOne
    private User creator;

    private LocalDateTime createdAt;
    private LocalDateTime dueDate;

}
