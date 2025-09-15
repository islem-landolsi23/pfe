package com.example.pfe.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    private String senderEmail;

    private String receiverEmail;
    private String content;
    private String fileUrl;
    @Enumerated(EnumType.STRING)
    private MessageState state;

    private String type;
    private LocalDateTime timestamp;
    @ManyToOne
    @JoinColumn(name = "conversation_id")
    //@JsonIgnore
    private Conversation conversation;
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;



}
