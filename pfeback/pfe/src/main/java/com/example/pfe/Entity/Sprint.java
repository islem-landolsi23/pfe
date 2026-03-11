package com.example.pfe.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.OffsetDateTime;
import java.util.List;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"project"}) // empêche la boucle infinie
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany( cascade = CascadeType.ALL)
    @JoinColumn(name = "sprint_id") // unidirectional join
    private List<Task> tasks;

    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private String status;

}
