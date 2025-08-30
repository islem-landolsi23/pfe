package com.example.pfe.Service;

import com.example.pfe.Entity.DTO.TaskDTO;
import com.example.pfe.Entity.Project;
import com.example.pfe.Entity.Sprint;
import com.example.pfe.Entity.Task;

import java.util.List;

public interface TaskService {


    public Task addTask(TaskDTO task) ;
    public Task updateTask(Task task) ;
    public void deleteTask(long id) ;
    public  Task getTaskById(long id) ;
    public List<Task> getTaskBySprint(Long sprintId);
    public List<Task>getTaskByUser(String email );
    public Task updateTaskStatus(TaskDTO task );
}
