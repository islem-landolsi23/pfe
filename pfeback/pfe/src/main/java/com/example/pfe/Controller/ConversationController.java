package com.example.pfe.Controller;


import com.example.pfe.Entity.ChatMessage;
import com.example.pfe.Entity.Conversation;
import com.example.pfe.Entity.DTO.ConversationDto;
import com.example.pfe.Entity.DTO.Mapper;
import com.example.pfe.Entity.Message;
import com.example.pfe.Entity.ParticipantsMessage;
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
 private  MessageRepository messageRepository ;
    @Autowired
    Mapper mapper ;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping("/private")
    public ConversationDto createOrGetPrivateChat(@RequestParam Long userAId, @RequestParam Long userBId) {

        System.out.println(userAId + "++++"+userBId);
        return mapper.toDto(conversationService.createOrGetConversation(userAId, userBId));
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




    @PostMapping("/createGroup")
    public ResponseEntity<ConversationDto> createConversation(
            @RequestBody ParticipantsMessage participantsMessage,
            @RequestParam Long createdById,
            @RequestParam boolean isGroup,
            @RequestParam(required = false) String title) {

        // Here participantsMessage contains emails → you can fetch userIds first
        // convert emails → ids via UserRepository
        List<Long> userIds = new ArrayList<>();
        for (String p : participantsMessage.getParticipants()) {
            Long parseLong = Long.parseLong(p);
            userIds.add(parseLong);
        }

        Conversation conversation = conversationService.createConversation(userIds, title, createdById, isGroup);
        return ResponseEntity.ok(mapper.toDto(conversation));
    }




    @GetMapping("/groups/{userId}")
    public List<ConversationDto> getGroupConversations(@PathVariable Long userId) {

        System.out.println(conversationService.getConversationById(5L));
        return conversationService.getGroupConversationsByUser(userId).stream()
                .map( conversation -> mapper.toDto(conversation)).toList();

       // return conversationService.getGroupConversationsByUser(userId) ;
    }

    @GetMapping("/getbyId/{Id}")
    public ConversationDto getById(@PathVariable Long Id) {


        return mapper.toDto(conversationService.getConversationById(Id).get()) ;

        // return conversationService.getGroupConversationsByUser(userId) ;
    }
}


