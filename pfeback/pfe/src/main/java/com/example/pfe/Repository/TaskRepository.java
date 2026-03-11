package com.example.pfe.Repository;

import com.example.pfe.Entity.Sprint;
import com.example.pfe.Entity.Task;
import com.example.pfe.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    public List<Task>getBySprint(Sprint sprint) ;
    public List<Task>getByAssignedUser(User user) ;
}
