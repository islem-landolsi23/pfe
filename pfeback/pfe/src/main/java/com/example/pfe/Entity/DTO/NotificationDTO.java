package com.example.pfe.Entity.DTO;


import lombok.Data;

@Data
public class NotificationDTO {

    private Long id ;
    private String title;
    private String message;
    private String receiverEmail;
    private String timestamp;
    private String senderEmail ;
    private  String type ;
    private  String taskUrl ;

    public NotificationDTO() {}

    public NotificationDTO(String title, String message, String receiverEmail,
                           String timestamp, String senderEmail,
                           String type, String taskUrl) {
        this.title = title;
        this.message = message;
        this.receiverEmail = receiverEmail;
        this.timestamp = timestamp;
        this.senderEmail = senderEmail;
        this.type = type;
        this.taskUrl = taskUrl;
    }



}
