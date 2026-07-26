package com.hasini.ai_interview_analyzer.service;

import com.hasini.ai_interview_analyzer.model.User;
import com.hasini.ai_interview_analyzer.model.PasswordResetToken;
import com.hasini.ai_interview_analyzer.repository.UserRepository;
import com.hasini.ai_interview_analyzer.dto.UserDto;
import com.hasini.ai_interview_analyzer.dto.LoginRequestDTO;
import com.hasini.ai_interview_analyzer.dto.UpdateUserDTO;
import com.hasini.ai_interview_analyzer.dto.ResetPasswordRequestDTO;
import com.hasini.ai_interview_analyzer.dto.ChangePasswordDTO;
import com.hasini.ai_interview_analyzer.dto.LoginResponseDTO;
import com.hasini.ai_interview_analyzer.repository.ResumeAnalysisRepository;
import com.hasini.ai_interview_analyzer.repository.InterviewHistoryRepository;
import com.hasini.ai_interview_analyzer.repository.InterviewQuestionRepository;
import com.hasini.ai_interview_analyzer.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private InterviewHistoryRepository interviewHistoryRepository;
    @Autowired
    private InterviewQuestionRepository interviewQuestionRepository;
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    @Autowired
    private EmailService emailService;

    public UserDto saveUser(UserDto userDto) {
        Optional<User> existingUser = userRepository.findByEmail(userDto.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        User savedUser = userRepository.save(user);

        UserDto responseDto = new UserDto();
        responseDto.setId(savedUser.getId());
        responseDto.setName(savedUser.getName());
        responseDto.setEmail(savedUser.getEmail());
        responseDto.setPassword(savedUser.getPassword());

        return responseDto;
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    public String deleteUser(Long id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        userRepository.delete(existingUser);
        return "User deleted successfully";
    }
    public UserDto updateUser(Long id, UpdateUserDTO userDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setName(userDto.getName());
        existingUser.setEmail(userDto.getEmail());

        User savedUser = userRepository.save(existingUser);

        UserDto responseDto = new UserDto();
        responseDto.setId(savedUser.getId());
        responseDto.setName(savedUser.getName());
        responseDto.setEmail(savedUser.getEmail());

        return responseDto;
    }
    public LoginResponseDTO loginUser(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        LoginResponseDTO response = new LoginResponseDTO();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setMessage("Login successful");

        return response;
    }

    public String resetPassword(ResetPasswordRequestDTO request) {

        Optional<PasswordResetToken> optionalToken =
                passwordResetTokenRepository.findByToken(request.getToken());

        if (optionalToken.isEmpty()) {
            return "Invalid reset link.";
        }

        PasswordResetToken resetToken = optionalToken.get();

        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(resetToken);

            return "Reset link has expired.";
        }

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);

        return "Password reset successfully.";
    }

    public String forgotPassword(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return "No account found with this email.";
        }

        User user = optionalUser.get();

        if (user == null) {
            return "No account found with this email.";
        }

        passwordResetTokenRepository.deleteByUser_Id(user.getId());

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(15));

        passwordResetTokenRepository.save(resetToken);

        String link =
                "http://localhost:5173/reset-password?token=" + token;

        emailService.sendEmail(
                user.getEmail(),
                "ElevraPath Password Reset",
                "Click the link below to reset your password:\n\n"
                        + link
                        + "\n\nThis link expires in 15 minutes."
        );

        return "Reset link sent successfully.";
    }
    public String changePassword(ChangePasswordDTO request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        return "Password updated successfully";
    }
    public void clearHistory(Long userId) {

        resumeAnalysisRepository.deleteByUserId(userId);

        interviewHistoryRepository.deleteByUserId(userId);

    }
    @Transactional
    public void deleteAccount(Long userId) {

        resumeAnalysisRepository.deleteByUserId(userId);

        interviewQuestionRepository.deleteQuestionsByUserId(userId);

        interviewHistoryRepository.deleteByUserId(userId);

        userRepository.deleteById(userId);
    }

    public LoginResponseDTO googleLogin(String credential) throws Exception {

        var payload = googleAuthService.verifyToken(credential);

        String email = payload.getEmail();
        String name = (String) payload.get("name");

        Optional<User> optionalUser = userRepository.findByEmail(email);

        User user;

        if (optionalUser.isPresent()) {

            user = optionalUser.get();

        } else {

            user = new User();

            user.setName(name);
            user.setEmail(email);

            user.setPassword(
                    passwordEncoder.encode("GOOGLE_LOGIN")
            );

            user = userRepository.save(user);
        }

        LoginResponseDTO response = new LoginResponseDTO();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setMessage("Login successful");

        return response;
    }
}
