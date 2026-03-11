package com.example.pfe.Controller;


import com.example.pfe.Entity.DTO.Mapper;
import com.example.pfe.Entity.DTO.ProjectDto;
import com.example.pfe.Entity.Project;
import com.example.pfe.Entity.Sprint;
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
    @Autowired
    private Mapper mapper ;


    @PostMapping("/add")
    public ProjectDto addProject(@RequestBody Project project) {
        return mapper.toDto(projectService.creatProject(project));
    }

    @GetMapping("/getAll")
    public List<ProjectDto> getProject() {
        return projectService.getProjectList().stream().map(p->mapper.toDto(p)).toList();
    }


    @GetMapping("/getById/{id}")
    public ProjectDto getProjectById(@PathVariable long id) {
        return mapper.toDto(projectService.getProjecrById(id));
    }


    @PostMapping("/addSprints")
    public ProjectDto addSprints(@RequestBody Project p)
    {
        Project project =projectService.getProjecrById(p.getId()) ;

        List<Sprint> sprintList = p.getSprints() ;
        sprintList.forEach(s ->{
            s.setProject(p);

        });
        project.setSprints(sprintList);
      return mapper.toDto(projectService.updateProject(project))  ;
    }

    @DeleteMapping("/Delete/{id}")
  public void   deletproject(@PathVariable long id)
    {
      Project p=  projectService.getProjecrById(id);
        this.projectService.deleteProject(p);
    }
    @PostMapping("/gengercool")
    public ProjectDto updateProject(@RequestBody Project p)
    {
        System.out.println("ena fil gengercool "+ mapper.toDto(p).toString());
        Project update = projectService.getProjecrById(p.getId());
        update.setName(p.getName());
        update.setDescription(p.getDescription());
        update.setStartDate(p.getStartDate());
        update.setEndDate(p.getEndDate());
       return mapper.toDto(projectService.updateProject(update)) ;
    }
}
