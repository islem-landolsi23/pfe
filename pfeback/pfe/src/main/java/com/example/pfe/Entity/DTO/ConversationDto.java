package com.example.pfe.Entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDto {


    Long id;
    String title;
    boolean isGroup;
    String createdAt;
    List<UserDto> participants ;
}
