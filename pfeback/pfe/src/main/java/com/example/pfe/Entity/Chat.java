package com.example.pfe.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import static jakarta.persistence.GenerationType.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Chat {




    @Id
    @GeneratedValue(strategy = UUID)
    private String id;
    @ManyToOne
    @JoinColumn(name = "senderEmail")
    private User sender;
    @ManyToOne
    @JoinColumn(name = "recipientEmail")
    private User recipient;
    @OneToMany(mappedBy = "chat", fetch = FetchType.EAGER)
    @OrderBy("createdDate DESC")
    private List<Message> messages;

}
