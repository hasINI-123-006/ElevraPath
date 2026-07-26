package com.hasini.ai_interview_analyzer.repository;

import com.hasini.ai_interview_analyzer.model.InterviewHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface InterviewHistoryRepository
        extends JpaRepository<InterviewHistory, Long> {

    List<InterviewHistory> findByUser_Id(Long userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM InterviewHistory i WHERE i.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    long countByUserId(Long userId);
    InterviewHistory findTopByUser_IdAndResumeNameOrderByIdDesc(
            Long userId,
            String resumeName
    );
}