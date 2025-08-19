package com.example.pfe.Entity;


import lombok.Data;

@Data
public class CallSignal {

    // "OFFER" | "ANSWER" | "CANDIDATE" | "END" | "REJECT" | "BUSY"
    private String type;
    private String callId;
    private String fromUserId; // or email
    private String toUserId;   // or email
    private String sdp;        // for OFFER / ANSWER
    private IceCandidate candidate;
}
