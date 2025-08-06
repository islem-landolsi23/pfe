package com.example.pfe.Controller;

import com.example.pfe.Entity.ChatMessage;
import com.example.pfe.Entity.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MessageWebSocketController {



    @Autowired
    private SimpMessagingTemplate template;

//    @MessageMapping("/chat/send")
//    public void sendMessage(@Payload Message message) {
//        template.convertAndSend("/topic/conversations/" + message.getConversationId(), message);
//    }




    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}")
    public ChatMessage chat(@DestinationVariable String roomId, ChatMessage message) {
        System.out.println("wa wa ya wy5ayeni");
        System.out.println(message);


        return new ChatMessage(message.getText(), message.getUser(), message.getTime());
    }
}
