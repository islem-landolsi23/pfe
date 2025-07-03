package com.example.pfe.Service;

import com.example.pfe.Entity.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectService {

    List<Project> getProjectsByOwner(Long userId);
    Project createProject(Project project, Long ownerId);
    Optional<Project> getById(Long id);
    void deleteProject(Long id);
}
