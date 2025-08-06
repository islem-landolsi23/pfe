package com.example.pfe.Service;

import com.example.pfe.Entity.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectService {

public Project creatProject(Project project);

public void deleteProject(Project project);

public Project updateProject(Project project);


public List<Project> getProjectList();


public Project getProjecrById(long id);
}
