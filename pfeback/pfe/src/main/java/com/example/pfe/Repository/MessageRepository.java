package com.example.pfe.Repository;

import com.example.pfe.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversation_Id(Long conversationId);
//    @Query("SELECT m FROM Message m JOIN FETCH m.conversation WHERE m.conversation.id = :conversationId")
//    List<Message> findMessagesByConversationId(@Param("conversationId") Long conversationId);
}
