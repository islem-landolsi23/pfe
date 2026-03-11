package com.example.pfe.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Choose where to store files (local or cloud)
            // Path relative to your project root
            String uploadDir = "uploads/";
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            Path path = Paths.get(uploadDir +timestamp +file.getOriginalFilename());

            // Ensure folder exists
            Files.createDirectories(path.getParent());

            // Save the file
            Files.write(path, file.getBytes());

            // Return the file URL (adjust for your hosting)
            String fileUrl = "/uploads/" +timestamp+ file.getOriginalFilename();
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            // return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
            System.out.println(e.getMessage());
        }

        return null;
    }
}
