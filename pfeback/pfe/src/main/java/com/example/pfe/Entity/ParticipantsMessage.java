package com.example.pfe.Entity;

import lombok.Data;

import java.util.Set;


@Data
public class ParticipantsMessage {

    private Set<String> participants;
    public ParticipantsMessage() {
        // no-args constructor needed for Jackson
    }
    public ParticipantsMessage(Set<String> participants) {
        this.participants = participants;
    }

    public Set<String> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<String> participants) {
        this.participants = participants;
    }

}
