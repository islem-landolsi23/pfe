package com.example.pfe.Service;

import com.example.pfe.Entity.Notification;
import com.example.pfe.Entity.User;
import com.example.pfe.Repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(String title, String message, User receiver, User sender,
                                           String type ,String taskurl) {
        Notification notification =
                new Notification(title, message, receiver, sender, LocalDateTime.now().toString(),type,taskurl);

        return notificationRepository.save(notification);
    }

    public List<Notification> getUnreadNotifications(String email) {
        return notificationRepository.findByReceiverEmailAndReadFalse(email);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public List<Notification> markAllAsRead(String email) {
       return  notificationRepository.findBySenderEmailAndReadFalse( email) ;

    }

}
