package com.hasini.ai_interview_analyzer.repository;

import com.hasini.ai_interview_analyzer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
