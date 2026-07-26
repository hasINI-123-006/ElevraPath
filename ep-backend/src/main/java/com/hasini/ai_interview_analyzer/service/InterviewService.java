package com.hasini.ai_interview_analyzer.service;
import com.hasini.ai_interview_analyzer.dto.AnswerRequestDTO;
import com.hasini.ai_interview_analyzer.dto.InterviewRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InterviewService {

    @Autowired
    private AIService aiService;

    public String generateQuestions(InterviewRequestDTO request) {

        String prompt = "Generate " + request.getType() + " questions for role "
                + request.getJobRole();

        return aiService.callAI(prompt);
    }

    public String evaluateAnswer(AnswerRequestDTO request) {

        String prompt = "Evaluate answer...\n" + request.getAnswer();

        return aiService.callAI(prompt);
    }
}