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


}
