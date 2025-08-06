package com.example.pfe.Controller;


import com.example.pfe.Entity.Sprint;
import com.example.pfe.Repository.SprintRepository;
import com.example.pfe.Service.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/sprint")
public class SprintController {

    @Autowired
    SprintService sprintService ;
    @Autowired
    private SprintRepository sprintRepository ;




    @GetMapping("/getById/{id}")
    public ResponseEntity<Sprint>  getSprintById(@PathVariable Long id)
    {

        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sprint not found"));
        return ResponseEntity.ok(sprint);
    }



}
