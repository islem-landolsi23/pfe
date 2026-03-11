package com.example.pfe.Entity.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDto {


    Long id;
    String name;
    String description;

    OffsetDateTime startDate;

    OffsetDateTime endDate;
    List<SprintDto> sprints ;
}
