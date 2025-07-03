package com.example.pfe.Service;

import com.example.pfe.Entity.Task;

import java.util.List;

public interface TaskService {
    Task createTask(Task task, Long projectId, Long creatorId);
    List<Task> getTasksByProject(Long projectId);
    void deleteTask(Long id);
}
