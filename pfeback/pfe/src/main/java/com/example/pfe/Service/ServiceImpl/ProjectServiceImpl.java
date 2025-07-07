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

}
