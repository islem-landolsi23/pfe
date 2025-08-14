package com.example.pfe.Entity;


import lombok.Data;

@Data
public class SignalMessage {

    private String type;  // "offer", "answer", "candidate", "join"
    private String sender;
    private String to;
    private Object data;
    private String roomId;
    private String target;
    public SignalMessage() {}


    public SignalMessage(String type, String sender, String target, Object data) {
        this.type = type;
        this.sender = sender;
        this.target = target;
        this.data = data;
    }
}
