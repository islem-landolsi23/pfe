package com.example.pfe.Controller;


import com.example.pfe.Entity.DTO.Mapper;
import com.example.pfe.Entity.DTO.NotificationDTO;
import com.example.pfe.Entity.Notification;
import com.example.pfe.Entity.User;
import com.example.pfe.Repository.UserRepository;
import com.example.pfe.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class NotificationWebSocketController {
    @Autowired
    Mapper mapper ;

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationWebSocketController(SimpMessagingTemplate messagingTemplate,
                                           NotificationService notificationService,
                                           UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // Client sends notification to /app/notify/{receiverEmail}
    @MessageMapping("/notify/{receiverEmail}")
    @SendTo("/queue/{receiverEmail}")
    public List<NotificationDTO> sendNotification(@DestinationVariable String receiverEmail, NotificationDTO notificationDTO) {
        // Find receiver
        User receiver = userRepository.findByEmail(receiverEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User sender = null;
        if (notificationDTO.getSenderEmail() != null) {
            sender = userRepository.findByEmail(notificationDTO.getSenderEmail()).orElse(null);
        }

        // Save in DB
        Notification saved = notificationService.createNotification(
                notificationDTO.getTitle(),
                notificationDTO.getMessage(),
                receiver,
                sender,
                notificationDTO.getType() ,
                notificationDTO.getTaskUrl()
        );

        // old

//           return new NotificationDTO(saved.getTitle(),
//                   saved.getMessage(), receiverEmail, saved.getTimestamp(),
//                   sender.getEmail(),notificationDTO.getType() ,notificationDTO.getTaskUrl()) ;

        List<NotificationDTO> listNotofication =  notificationService.getUnreadNotifications(notificationDTO.getReceiverEmail()).stream().map(
                notification -> mapper.toDTO(notification)
        ).toList();

        listNotofication.forEach( n->{
            System.out.println(n.toString());
        });
        return  listNotofication;




        // Send to frontend topic
//        messagingTemplate.convertAndSend(
//                "/queue/notifications/" + receiverEmail,
//                new NotificationDTO(saved.getTitle(), saved.getMessage(), receiverEmail, saved.getTimestamp())
//        );


    }




//    @MessageMapping("/notify/{receiverEmail}")
//    public void sendNotification(@DestinationVariable String receiverEmail, NotificationDTO notification) {
//        messagingTemplate.convertAndSendToUser(
//                receiverEmail,
//                "/queue/notifications",
//                notification
//        );
//    }
}
