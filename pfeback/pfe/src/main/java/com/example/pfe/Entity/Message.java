package com.example.pfe.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue
    private Long id;
    @Column(nullable = false)
    private String senderEmail;
    @Column( nullable = false)
    private String receiverEmail;
    private String content;
    private String fileUrl;
    @Enumerated(EnumType.STRING)
    private MessageState state;
    @Enumerated(EnumType.STRING)
    private MessageType type;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;
}
