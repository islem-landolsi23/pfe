package com.example.pfe.Entity;


import lombok.Data;

@Data
public class CallNotification {

    private String fromEmail;
    private String toEmail;
    private String type; // "CALL","ACCEPTED","DECLINED","SDP_OFFER","SDP_ANSWER","ICE"
    private String sdp;  // for SDP offer/answer
    private IceCandidate candidate; // for ICE
}
