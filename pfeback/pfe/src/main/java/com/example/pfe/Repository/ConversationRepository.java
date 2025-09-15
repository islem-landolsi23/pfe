package com.example.pfe.Repository;

import com.example.pfe.Entity.Conversation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
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

    @Query("SELECT DISTINCT c FROM Conversation c " +
            "LEFT JOIN FETCH c.participants " +
            "WHERE c.isGroup = true AND EXISTS (" +
            "  SELECT 1 FROM c.participants p WHERE p.id = :userId)")
    List<Conversation> findByParticipants_IdAndIsGroupTrue( @Param("userId") Long userId);



    @Query("SELECT DISTINCT c FROM Conversation c " +
            "JOIN c.participants pFilter " +                       // filter by user membership
            "LEFT JOIN FETCH c.participants pFetch " +            // fetch all participants
            "WHERE pFilter.id = :userId AND c.isGroup = true")
    List<Conversation> findGroupConversationsByUserId(@Param("userId") Long userId);


    @Query("SELECT c FROM Conversation c JOIN FETCH c.participants WHERE c.isGroup = true")
    List<Conversation> findAllGroupConversationsWithParticipants();
}
