package com.example.pfe.Controller;

import com.example.pfe.Entity.SignalMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class AudioCallController {
    private final SimpMessagingTemplate messagingTemplate;

    public AudioCallController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/audio-call")
    public void initiateCall(Map<String, String> payload) {
        String calleeId = payload.get("calleeId");
        String callerName = payload.get("callerName");
        String callerId = "123"; // TODO: get from authenticated user

        messagingTemplate.convertAndSendToUser(
                calleeId, "/queue/audio-call",
                Map.of("callerId", callerId, "callerName", callerName)
        );
    }

    @MessageMapping("/audio-call-accept")
    public void acceptCall(Map<String, String> payload) {
        String callerId = payload.get("callerId");
        messagingTemplate.convertAndSendToUser(callerId, "/queue/audio-call-accepted", "");
    }

    @MessageMapping("/audio-call-deny")
    public void denyCall(Map<String, String> payload) {
        String callerId = payload.get("callerId");
        messagingTemplate.convertAndSendToUser(callerId, "/queue/audio-call-denied", "");
    }


}
