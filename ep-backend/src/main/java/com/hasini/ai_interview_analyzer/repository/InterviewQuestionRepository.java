package com.hasini.ai_interview_analyzer.repository;
import com.hasini.ai_interview_analyzer.model.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {

    List<InterviewQuestion> findByInterviewHistoryId(Long historyId);
    @Transactional
    @Modifying
    @Query("""
           DELETE FROM InterviewQuestion q
           WHERE q.interviewHistory.user.id = :userId
           """)
    void deleteQuestionsByUserId(Long userId);

}
