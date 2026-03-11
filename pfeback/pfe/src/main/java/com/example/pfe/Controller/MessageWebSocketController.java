package com.example.pfe.Controller;

import com.example.pfe.Entity.ChatMessage;
import com.example.pfe.Entity.Message;
import com.example.pfe.Entity.MessageType;
import com.example.pfe.Entity.User;
import com.example.pfe.Repository.ConversationRepository;
import com.example.pfe.Repository.MessageRepository;
import com.example.pfe.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class MessageWebSocketController {



    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private ConversationRepository conversationRepository ;
    @Autowired
    private MessageRepository messageRepository ;
    @Autowired
    UserRepository userRepository ;

//    @MessageMapping("/chat/send")
//    public void sendMessage(@Payload Message message) {
//        template.convertAndSend("/topic/conversations/" + message.getConversationId(), message);
//    }




    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}")
    public ChatMessage chat(@DestinationVariable String roomId, ChatMessage message) {

        Message newMessage = new Message();
        newMessage.setContent(message.getContent());
        User user =userRepository.findByEmail(message.getUser()).get();
        System.out.println("test email" +user.getEmail());
        newMessage.setSender(user);
        newMessage.setSenderEmail(user.getEmail());
        newMessage.setConversation(conversationRepository.getById(

                Long.parseLong( message.getConversationID())
               ));
        newMessage.setReceiverEmail(message.getReceiverEmail());

        LocalDateTime dateTime = LocalDateTime.now();

        newMessage.setTimestamp(dateTime);

        System.out.println(newMessage.toString());

        newMessage.setFileUrl(message.getFile_Url());
        newMessage.setType(message.getFileType());
        System.out.println(message.getId());
        System.out.println("**************************"+message.getId() != null);
        Message m = new Message();
        if(message.getId() != null)
        {  newMessage.setId(message.getId());
             m=  messageRepository.save(newMessage);
            System.out.println("the id "+m.getId());
        }
        else { m=  messageRepository.save(newMessage);}





        return new ChatMessage(m.getId(), message.getUser(),
                message.getContent(),
                message.getTimestamp(),
                message.getFile_Url(), message.getConversationID(),
                message.getReceiverEmail(),
                message.getFileType());
    }




}
