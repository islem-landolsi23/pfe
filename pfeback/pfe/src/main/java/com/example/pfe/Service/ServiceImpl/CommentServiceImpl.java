package com.example.pfe.Service.ServiceImpl;

import com.example.pfe.Entity.Comment;
import com.example.pfe.Entity.Task;
import com.example.pfe.Entity.User;
import com.example.pfe.Repository.CommentRepository;
import com.example.pfe.Repository.TaskRepository;
import com.example.pfe.Repository.UserRepository;
import com.example.pfe.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class CommentServiceImpl  implements CommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public Comment addComment(String content, Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setTask(task);
        comment.setAuthor(author);
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByTask(Long taskId) {
        return commentRepository.findByTaskId(taskId);
    }
}
