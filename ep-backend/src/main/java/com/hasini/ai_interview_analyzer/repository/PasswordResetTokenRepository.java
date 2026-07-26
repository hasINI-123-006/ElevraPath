package com.hasini.ai_interview_analyzer.repository;

import com.hasini.ai_interview_analyzer.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser_Id(Long userId);
}