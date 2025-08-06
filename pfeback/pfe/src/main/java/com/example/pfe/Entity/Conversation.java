package com.example.pfe.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

import java.util.List;

@Entity
public class Conversation {

    @Id
    @GeneratedValue
    private Long id;
    private String title;
    @ManyToMany
    private List<User> participants;
}
