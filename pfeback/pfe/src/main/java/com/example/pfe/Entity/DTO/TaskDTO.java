package com.example.pfe.Entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDTO {


    Long id;
    String title;
    String description;
    String status;
    String priority;
    String createdAt;
    String dueDate;
    Long sprintId;
    Long assignedUserId ;
}
