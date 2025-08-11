package com.example.pfe.Controller;


import com.example.pfe.Entity.ChatMessage;
import com.example.pfe.Entity.Conversation;
import com.example.pfe.Entity.Message;
import com.example.pfe.Repository.MessageRepository;
import com.example.pfe.Service.ServiceImpl.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;
    @Autowired
 private    MessageRepository messageRepository ;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping("/private")
    public Conversation createOrGetPrivateChat(@RequestParam Long userAId, @RequestParam Long userBId) {

        System.out.println(userAId + "++++"+userBId);
        return conversationService.createOrGetConversation(userAId, userBId);
    }

    @GetMapping("/getMessages/{conversationId}")
    public ResponseEntity<List<ChatMessage>> hetMessageByConversationId(@PathVariable  String conversationId)
    {
        List<Message> messageList =messageRepository.findByConversation_Id(
                Long.parseLong(  conversationId)
              );
        List<ChatMessage> chatMessageList = new ArrayList<>();
        messageList.forEach(message -> {
            ChatMessage chatMessage =new ChatMessage();
            chatMessage.setConversationID(message.getConversation().getId().toString());
            chatMessage.setUser(message.getSenderEmail());
            chatMessage.setReceiverEmail(message.getReceiverEmail());
            chatMessage.setTimestamp(message.getTimestamp().toString());
            chatMessage.setContent(message.getContent());
            chatMessage.setFileType(message.getType());
            chatMessage.setFile_Url(message.getFileUrl());
            chatMessageList.add(chatMessage);
        });
chatMessageList.forEach(m ->{
    System.out.println(m);
});
        return  ResponseEntity.ok(chatMessageList) ;

    }
}


