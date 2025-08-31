package com.example.pfe.Controller;


import com.example.pfe.Entity.DTO.Mapper;
import com.example.pfe.Entity.DTO.NotificationDTO;
import com.example.pfe.Entity.Notification;
import com.example.pfe.Repository.NotificationRepository;
import com.example.pfe.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {


    @Autowired
    NotificationService notificationService ;
    @Autowired
    NotificationRepository notificationRepository ;
    @Autowired
    Mapper mapper ;




    @GetMapping("/getNotification/{email}")
    public List<NotificationDTO> getNotification(@PathVariable String email)
    {
        List<Notification  > notifications = notificationService.getUnreadNotifications(email);
        return  notifications.
                stream().
                map( notification -> mapper.toDTO(notification)).toList();
    }
    @PostMapping("/markAsRead")
    public List<NotificationDTO> markAsRead(@RequestBody NotificationDTO notificationDTO)
    {
        List<Notification > notifications = notificationService.turnAllARead(
                notificationDTO.getReceiverEmail(),notificationDTO.getSenderEmail()) ;
        List<Notification>ReadList = new ArrayList<>();
        notifications.forEach(notification -> {
            notification.setRead(true);
            ReadList.add(notification);
        });
        notificationRepository.saveAll(ReadList);
       return ReadList.stream().map(n -> mapper.toDTO(n)  ).toList() ;
    }

    @PostMapping("/markMessageAsRead")
    public void markMessageAsRead(@RequestBody NotificationDTO notificationDTO)
    {

       notificationService.markAsRead(notificationDTO.getId());
      //  return ReadList.stream().map(n -> mapper.toDTO(n)  ).toList() ;
    }
}
