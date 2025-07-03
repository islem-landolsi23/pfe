package com.example.pfe.Service;

import com.example.pfe.Entity.Comment;

import java.util.List;

public interface CommentService {
    Comment addComment(String content, Long taskId, Long userId);
    List<Comment> getCommentsByTask(Long taskId);
}
