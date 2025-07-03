package com.example.pfe.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue
    private Long id;

    private String content;

    @ManyToOne
    private Task task;

    @ManyToOne
    private User author;

    private LocalDateTime createdAt;
}
