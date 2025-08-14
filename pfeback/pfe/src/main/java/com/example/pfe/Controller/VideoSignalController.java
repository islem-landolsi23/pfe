package com.example.pfe.Controller;


import com.example.pfe.Entity.NewPeerMessage;
import com.example.pfe.Entity.ParticipantsMessage;
import com.example.pfe.Entity.SignalMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

@RestController
public class VideoSignalController {



    private final SimpMessagingTemplate messagingTemplate;
    private final HashMap<String, Set<String>> roomParticipants = new HashMap<>();

    public VideoSignalController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }


    @MessageMapping("/signal/{roomId}")
    public void signaling(@DestinationVariable String roomId, SignalMessage message) {
        System.out.println("roomid = "+roomId);
        System.out.println("message = "+message);
        // Broadcast to all clients in this room
        messagingTemplate.convertAndSend("/topic/" + roomId, message);
    }


}
