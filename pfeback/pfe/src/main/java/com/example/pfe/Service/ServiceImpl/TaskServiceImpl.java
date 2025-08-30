package com.example.pfe.Service.ServiceImpl;

import com.example.pfe.Entity.DTO.TaskDTO;
import com.example.pfe.Entity.Project;
import com.example.pfe.Entity.Sprint;
import com.example.pfe.Entity.Task;
import com.example.pfe.Entity.User;
import com.example.pfe.Repository.ProjectRepository;
import com.example.pfe.Repository.SprintRepository;
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
    @Autowired
  private  SprintRepository sprintRepository ;

    @Override
    public Task addTask(TaskDTO task) {

        Task taskToAdd =new Task();
        taskToAdd.setTitle(task.getTitle());
        taskToAdd.setPriority(task.getPriority());
        taskToAdd.setDescription(task.getDescription());
        taskToAdd.setStatus(task.getStatus());


        taskToAdd.setCreatedAt( LocalDateTime.now().toString());

        taskToAdd.setDueDate(task.getDueDate());

        taskToAdd.setAssignedUser(userRepository.
                getReferenceById(task.getAssignedUserId()
                       ));
        taskToAdd.setSprint(sprintRepository.getReferenceById(task.getSprintId()));

        return taskRepository.save(taskToAdd);
    }

    @Override
    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(long id) {
         taskRepository.deleteById(id);
    }

    @Override
    public Task getTaskById(long id) {
     return taskRepository.getById(id);
    }

    @Override
    public List<Task> getTaskBySprint(Long sprintId) {
        Sprint sprint =sprintRepository.getReferenceById(sprintId);
        return  taskRepository.getBySprint(sprint) ;

    }

    @Override
    public List<Task> getTaskByUser(String email) {
      //  User user =userRepository.getReferenceById(userId);
        User user = userRepository.findByEmail(email).get() ;
        return  taskRepository.getByAssignedUser(user) ;
    }

    @Override
    public Task updateTaskStatus(TaskDTO task) {

        Task taskToUpdate = taskRepository.getReferenceById(task.getId());

        taskToUpdate.setStatus(task.getStatus());

        return taskRepository.save(taskToUpdate);
    }
}
