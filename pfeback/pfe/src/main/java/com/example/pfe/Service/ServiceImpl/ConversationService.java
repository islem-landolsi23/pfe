package com.example.pfe.Service.ServiceImpl;


import com.example.pfe.Entity.Conversation;
import com.example.pfe.Entity.User;
import com.example.pfe.Repository.ConversationRepository;
import com.example.pfe.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository ;
    public ConversationService(ConversationRepository conversationRepository ,UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    public List<Conversation> getAllConversations() { return conversationRepository.findAll(); }
    public Optional<Conversation> getConversationById(Long id) { return conversationRepository.findById(id); }
    public Conversation saveConversation(Conversation conversation) { return conversationRepository.save(conversation); }
    public void deleteConversation(Long id) { conversationRepository.deleteById(id); }


    public Conversation createOrGetConversation(Long userAId, Long userBId) {

            if (userAId.equals(userBId)) {
                // Handle self-chat (conversation with only one participant)
                Optional<Conversation> existing = conversationRepository
                        .findPrivateConversationWithSingleUser(userAId);

                if (existing.isPresent()) return existing.get();

                User user = userRepository.findById(userAId)
                        .orElseThrow(() -> new RuntimeException("User not found: " + userAId));

                Conversation conversation = new Conversation();
                conversation.setGroup(false);
                conversation.setCreatedAt(LocalDateTime.now().toString());
                conversation.setCreatedBy(user);
                conversation.setTitle("Notes to self");
                conversation.setParticipants(Set.of(user));

                return conversationRepository.save(conversation);
            } else {
                // existing code for two different users
                Optional<Conversation> existing = conversationRepository
                        .findPrivateConversationBetweenUsers(userAId, userBId);

                if (existing.isPresent()) return existing.get();

                User userA = userRepository.findById(userAId)
                        .orElseThrow(() -> new RuntimeException("User not found: " + userAId));
                User userB = userRepository.findById(userBId)
                        .orElseThrow(() -> new RuntimeException("User not found: " + userBId));

                Conversation conversation = new Conversation();
                conversation.setGroup(false);
                conversation.setCreatedAt(LocalDateTime.now().toString());
                conversation.setCreatedBy(userA);
                conversation.setTitle(userA.getName() + " & " + userB.getName());
                conversation.setParticipants(new HashSet<>(Arrays.asList(userA, userB)));

                return conversationRepository.save(conversation);
            }
        }





}
