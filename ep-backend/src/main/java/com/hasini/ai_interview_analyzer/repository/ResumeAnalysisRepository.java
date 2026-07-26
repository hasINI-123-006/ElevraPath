package com.hasini.ai_interview_analyzer.repository;

import com.hasini.ai_interview_analyzer.model.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {

    List<ResumeAnalysis> findByUser_IdOrderByIdDesc(Long userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM ResumeAnalysis r WHERE r.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    long countByUser_Id(Long userId);
    ResumeAnalysis findTopByUser_IdOrderByIdDesc(Long userId);
    List<ResumeAnalysis> findByUser_IdAndTargetRoleOrderByIdAsc(
            Long userId,
            String targetRole
    );
    @Query("""
SELECT DISTINCT r.targetRole
FROM ResumeAnalysis r
WHERE r.user.id = :userId
ORDER BY r.targetRole
""")
    List<String> findDistinctRolesByUserId(@Param("userId") Long userId);

}