package com.example.pfe.Service.ServiceImpl;

import com.example.pfe.Entity.Sprint;
import com.example.pfe.Repository.SprintRepository;
import com.example.pfe.Service.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class SprintServiceImpl implements SprintService {

    @Autowired
    SprintRepository sprintRepository ;

    @Override
    public Sprint getSprintById(Long sprintId) {
        return sprintRepository.getById(sprintId);
    }
}
