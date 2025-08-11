package com.example.pfe.Repository;

import com.example.pfe.Entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {


    @Query("""
    SELECT c FROM Conversation c
    JOIN c.participants p1
    JOIN c.participants p2
    WHERE p1.id = :userAId AND p2.id = :userBId
      AND SIZE(c.participants) = 2
      AND c.isGroup = false """)
    Optional<Conversation> findPrivateConversationBetweenUsers(Long userAId, Long userBId);



    @Query("""
    SELECT c FROM Conversation c
    JOIN c.participants p
    WHERE p.id = :userId
      AND SIZE(c.participants) = 1
      AND c.isGroup = false
""")
    Optional<Conversation> findPrivateConversationWithSingleUser(Long userId);
}
