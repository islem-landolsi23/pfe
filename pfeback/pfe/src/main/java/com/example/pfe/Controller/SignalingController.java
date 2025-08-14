//package com.example.pfe.Controller;
//
//import com.example.pfe.Entity.SignalMessage;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//@Controller
//public class SignalingController {
//
//
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;
//
//    @MessageMapping("/signal")
//    public void handleSignal(@Payload SignalMessage message) {
//        System.out.println("Signal from " + message.getFrom() + " in room " + message.getRoomId());
//
//        // Broadcast to everyone in the room (including sender)
//        messagingTemplate.convertAndSend("/topic/room/" + message.getRoomId(), message);
//    }
//}
