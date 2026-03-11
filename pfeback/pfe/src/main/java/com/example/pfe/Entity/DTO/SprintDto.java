package com.example.pfe.Entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SprintDto {


    Long id;
    String name;
    OffsetDateTime startDate;
    OffsetDateTime endDate;
    String status;
    Long projectId;
    List<TaskDTO> tasks ;
}
