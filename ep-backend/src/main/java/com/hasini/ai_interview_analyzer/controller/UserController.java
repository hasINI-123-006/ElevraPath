package com.hasini.ai_interview_analyzer.controller;
import com.hasini.ai_interview_analyzer.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import com.hasini.ai_interview_analyzer.service.UserService;
import com.hasini.ai_interview_analyzer.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.hasini.ai_interview_analyzer.dto.*;
import com.hasini.ai_interview_analyzer.service.ResumeService;
import com.hasini.ai_interview_analyzer.service.InterviewService;
import com.hasini.ai_interview_analyzer.dto.LoginRequestDTO;
import com.hasini.ai_interview_analyzer.dto.AnalysisResponseDTO;
import com.hasini.ai_interview_analyzer.dto.GoogleLoginRequestDTO;
import org.springframework.web.multipart.MultipartFile;
import com.hasini.ai_interview_analyzer.service.AIService;
import com.hasini.ai_interview_analyzer.service.HistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.List;
@RestController

public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private ResumeService resumeService;
    @Autowired
    private InterviewService interviewService;
    @Autowired
    private AIService aiService;
    @Autowired
    private HistoryService historyService;

    @PostMapping("/saveUser")
    public ResponseEntity<?> saveUser(@Valid @RequestBody UserDto userDto) {

        try {

            UserDto savedUser = userService.saveUser(userDto);

            return ResponseEntity.ok(savedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));

        }

    }
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }
    @PutMapping("/user/{id}")
    public UserDto updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserDTO userDTO) {
        return userService.updateUser(id, userDTO);
    }
    @PostMapping("/analyze-resume")
    public AnalysisResponseDTO analyzeResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobRole") String jobRole,
            @RequestParam(value = "jobDescription", required = false)
            String jobDescription,
             @RequestParam("userId") Long userId
    ) {

        return resumeService.analyzeResume(
                file,
                jobRole,
                jobDescription,
                userId
        );
    }

    @PostMapping("/generate-questions")
    public String generateQuestions(@RequestBody InterviewRequestDTO request) {
        return interviewService.generateQuestions(request);
    }
    @PostMapping("/evaluate")
    public String evaluate(@RequestBody AnswerRequestDTO request) {
        return interviewService.evaluateAnswer(request);
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO request) {

        try {

            LoginResponseDTO response = userService.loginUser(request);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));

        }

    }

    @PostMapping("/clear-history")
    public String clearHistory(@RequestParam Long userId) {

        return historyService.clearHistory(userId);

    }

    @DeleteMapping("/delete-account")
    public String deleteAccount(@RequestParam Long userId) {

        userService.deleteAccount(userId);

        return "Account deleted successfully";
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequestDTO request
    ) {
        try {
            String result = userService.resetPassword(request);

            return ResponseEntity.ok(
                    Map.of("message", result)
            );

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {

        try {

            String email = request.get("email");

            String result = userService.forgotPassword(email);

            return ResponseEntity.ok(Map.of("message", result));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }


    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordDTO request
    ) {

        try {

            String message = userService.changePassword(request);

            return ResponseEntity.ok(
                    Map.of("message", message)
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );

        }

    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(
            @RequestBody GoogleLoginRequestDTO request
    ) {

        try {

            LoginResponseDTO response =
                    userService.googleLogin(request.getCredential());

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );

        }

    }

    
}
