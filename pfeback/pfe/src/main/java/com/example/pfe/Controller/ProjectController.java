package com.example.pfe.Controller;


import com.example.pfe.Entity.Project;
import com.example.pfe.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {


    @Autowired
    private ProjectService projectService;

    @GetMapping("/owner/{ownerId}")
    public List<Project> getProjectsByOwner(@PathVariable Long ownerId) {
        return projectService.getProjectsByOwner(ownerId);
    }

    @PostMapping("/create")
    public ResponseEntity<Project> create(@RequestBody Project project, @RequestParam Long ownerId) {
        return ResponseEntity.ok(projectService.createProject(project, ownerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) {
        return projectService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
