package com.example.pfe.Entity;

import jakarta.persistence.*;
import lombok.*;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    @Column(name = "github_id", unique = true)
    private String githubId;

    private String avatarUrl;

    @OneToMany(mappedBy = "assignedUser")
    private List<Task> assignedTasks = new ArrayList<>();

    @OneToMany(mappedBy = "author")
    private List<Comment> comments = new ArrayList<>();
}
