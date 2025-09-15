package com.example.pfe.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notifications")
@Data

public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;

    private boolean read = false;

    private String timestamp;

    // Receiver (mandatory)
    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    // Optional: Sender (e.g., who caused the notification)
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
    private String type ;
    private  String taskUrl ;

    // --- Constructors ---
    public Notification() {}

    public Notification(String title, String message,User receiver, User sender, String timestamp,  String type, String taskUrl) {
        this.title = title;
        this.message = message;

        this.timestamp = timestamp;
        this.receiver = receiver;
        this.sender = sender;
        this.type = type;
        this.taskUrl = taskUrl;
    }
}


