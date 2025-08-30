package com.example.pfe.Repository;

import com.example.pfe.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository  extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverEmailAndReadFalse(String email);
    List<Notification> findBySenderEmailAndReadFalse(String email);
}
