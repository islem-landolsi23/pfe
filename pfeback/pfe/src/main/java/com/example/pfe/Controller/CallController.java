package com.example.pfe.Controller;

import com.example.pfe.Entity.CallNotification;
import com.example.pfe.Entity.CallSignal;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class CallController {


    @MessageMapping("/call/{email}")
    @SendTo("/topic/call/{email}")
    public CallNotification call(@DestinationVariable String email, CallNotification notification) {
        // just forward the notification
        return notification;
    }
}
