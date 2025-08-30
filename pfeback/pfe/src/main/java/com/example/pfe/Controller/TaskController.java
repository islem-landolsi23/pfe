package com.example.pfe.Controller;

import com.example.pfe.Entity.DTO.Mapper;
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
    @Autowired
    Mapper mapper ;



    @GetMapping("/getBySprint/{sprintId}")
    public List<TaskDTO> getTaskBySprint(@PathVariable Long sprintId)
    {

        System.out.println("ena d5aloit");
//        List<Task> list = taskService.getTaskBySprint(sprintId) ;
//        System.out.println(list.size());
        return taskService.getTaskBySprint(sprintId).stream().map(task -> mapper.toDto(task)).toList() ;
    }


    @GetMapping("/getByUser/{userEmail}")
    public List<TaskDTO> getTaskByUser(@PathVariable String userEmail)
    {

        System.out.println("ena d5aloit");
//        List<Task> list = taskService.getTaskBySprint(sprintId) ;
//        System.out.println(list.size());
        return taskService.getTaskByUser(userEmail).stream().map(task -> mapper.toDto(task)).toList() ;
    }



    @PostMapping("/addTask")
    public TaskDTO addTask(@RequestBody TaskDTO task)
    {
        return mapper.toDto(taskService.addTask(task) );
    }

    @DeleteMapping("/deleteTask/{id}")
    public void deleteTask(@PathVariable Long id)
    {
         taskService.deleteTask(id) ;
    }

    @PutMapping("/updateStatus")
    public TaskDTO updateTaskStatus(@RequestBody TaskDTO task)
    {

       return  mapper.toDto(taskService.updateTaskStatus(task)) ;
    }

}
