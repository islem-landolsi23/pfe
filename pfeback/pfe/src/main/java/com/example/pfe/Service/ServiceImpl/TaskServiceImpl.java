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

}
