package com.example.pfe.Entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    Long id ;
    String name;
    String email;
    String avatarUrl ;
    String password ;
}
