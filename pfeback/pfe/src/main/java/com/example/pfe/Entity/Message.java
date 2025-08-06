package com.example.pfe.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Message {

    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne
    private User sender;
    @ManyToOne private Conversation conversation;
    private String content;
    private String type; // TEXT, IMAGE, VIDEO, DOC
    private String fileUrl;
    private LocalDateTime timestamp;
}
