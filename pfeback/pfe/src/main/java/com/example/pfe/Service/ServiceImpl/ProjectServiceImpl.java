package com.example.pfe.Service.ServiceImpl;

import com.example.pfe.Entity.Project;
import com.example.pfe.Entity.User;
import com.example.pfe.Repository.ProjectRepository;
import com.example.pfe.Repository.UserRepository;
import com.example.pfe.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository ;
    @Autowired
    UserRepository userRepository ;
    @Override
    public List<Project> getProjectsByOwner(Long userId) {
        return projectRepository.findByOwnerId(userId);
    }

    @Override
    public Project createProject(Project project, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        project.setOwner(owner);
        project.setCreatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    @Override
    public Optional<Project> getById(Long id) {
          return projectRepository.findById(id);
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
