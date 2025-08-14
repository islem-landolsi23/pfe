package com.example.pfe.Entity;


import lombok.Data;

@Data
public class NewPeerMessage {

    private String newPeerId;


    public NewPeerMessage(String newPeerId) {
        this.newPeerId = newPeerId;
    }

    public String getNewPeerId() {
        return newPeerId;
    }

    public void setNewPeerId(String newPeerId) {
        this.newPeerId = newPeerId;
    }
}
