package com.example.pfe.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"sprints"}) // si Project a une liste de sprints
public class Project {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String description;

    @OneToMany( cascade = CascadeType.ALL)
    @JoinColumn(name = "project_id")
    private List<Sprint> sprints;



    private OffsetDateTime startDate;
   private OffsetDateTime endDate;

}
