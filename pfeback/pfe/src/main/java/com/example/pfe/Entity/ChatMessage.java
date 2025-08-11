package com.example.pfe.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChatMessage {

    String user;
    String content ;
    String timestamp;
    String file_Url ;
    String conversationID ;
    String receiverEmail ;
    String fileType ;
}
