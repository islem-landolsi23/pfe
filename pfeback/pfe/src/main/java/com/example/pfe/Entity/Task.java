package com.example.pfe.Entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;


    private String status ;
    private String        priority;

    @ManyToOne
    @JoinColumn(name = "sprint_id")
    @JsonBackReference // child
    private Sprint sprint;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User assignedUser;
    private String createdAt;
    private String dueDate;

}
