package com.example.pfe.Service.ServiceImpl;

import com.example.pfe.Entity.Project;
import com.example.pfe.Entity.Task;
import com.example.pfe.Entity.User;
import com.example.pfe.Repository.ProjectRepository;
import com.example.pfe.Repository.TaskRepository;
import com.example.pfe.Repository.UserRepository;
import com.example.pfe.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Override
    public Task createTask(Task task, Long projectId, Long creatorId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        task.setProject(project);
        task.setCreator(creator);
        task.setCreatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);

    }
}
