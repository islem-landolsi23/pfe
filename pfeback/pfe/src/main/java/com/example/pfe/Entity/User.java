package com.example.pfe.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@ToString(exclude = {"assignedTasks"})
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    private String password ;

    @Column(name = "github_id", unique = true)
    private String githubId;

    private String avatarUrl;

    @OneToMany(mappedBy = "assignedUser")
    @JsonManagedReference
    private List<Task> assignedTasks = new ArrayList<>();

    @OneToMany(mappedBy = "author")
    private List<Comment> comments = new ArrayList<>();


    @ManyToMany(mappedBy = "participants")

    private Set<Conversation> conversations;
}
