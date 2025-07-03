package com.example.pfe.Controller;

import com.example.pfe.Entity.Comment;
import com.example.pfe.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private  CommentService commentService;

    @PostMapping("/add")
    public ResponseEntity<Comment> addComment(@RequestParam String content,
                                              @RequestParam Long taskId,
                                              @RequestParam Long userId) {
        return ResponseEntity.ok(commentService.addComment(content, taskId, userId));
    }

    @GetMapping("/task/{taskId}")
    public List<Comment> getCommentsByTask(@PathVariable Long taskId) {
        return commentService.getCommentsByTask(taskId);
    }
}
