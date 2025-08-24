package com.example.pfe.Controller;

import com.example.pfe.Entity.DTO.TaskDTO;
import com.example.pfe.Entity.Sprint;
import com.example.pfe.Entity.Task;
import com.example.pfe.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;



    @PostMapping("/getBySprint")
    public List<Task> getTaskBySprint(@RequestBody Sprint sprint)
    {
        return taskService.getTaskBySprint(sprint) ;
    }



    @PostMapping("/addTask")
    public Task addTask(@RequestBody TaskDTO task)
    {
        return taskService.addTask(task) ;
    }

}
