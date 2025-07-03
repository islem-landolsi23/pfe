package com.example.pfe.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.scheduling.config.Task;

import javax.xml.stream.events.Comment;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Project> ownedProjects = new ArrayList<>();

    @ManyToMany(mappedBy = "members")
    private Set<Project> projects = new HashSet<>();

    @OneToMany(mappedBy = "creator")
    private List<Task> createdTasks = new ArrayList<>();

    @OneToMany(mappedBy = "assignee")
    private List<Task> assignedTasks = new ArrayList<>();

    @OneToMany(mappedBy = "author")
    private List<Comment> comments = new ArrayList<>();
}
