package com.example.pfe.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String description;

    @ManyToOne
    private User owner;

    @ManyToMany
    private Set<User> members;

    private LocalDateTime createdAt;
}
