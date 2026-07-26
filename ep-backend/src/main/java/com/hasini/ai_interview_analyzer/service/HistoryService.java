package com.hasini.ai_interview_analyzer.service;

import com.hasini.ai_interview_analyzer.repository.ResumeAnalysisRepository;
import com.hasini.ai_interview_analyzer.repository.InterviewHistoryRepository;
import com.hasini.ai_interview_analyzer.repository.InterviewQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class HistoryService {

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    @Autowired
    private InterviewQuestionRepository interviewQuestionRepository;

    @Autowired
    private InterviewHistoryRepository interviewHistoryRepository;

    public String clearHistory(Long userId) {

        resumeAnalysisRepository.deleteByUserId(userId);

        interviewQuestionRepository.deleteQuestionsByUserId(userId);

        interviewHistoryRepository.deleteByUserId(userId);

        return "History cleared successfully";
    }
}
