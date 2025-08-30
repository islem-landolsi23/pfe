package com.example.pfe.Controller;


import com.example.pfe.Entity.DTO.Mapper;
import com.example.pfe.Entity.DTO.NotificationDTO;
import com.example.pfe.Entity.Notification;
import com.example.pfe.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {


    @Autowired
    NotificationService notificationService ;
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
}
