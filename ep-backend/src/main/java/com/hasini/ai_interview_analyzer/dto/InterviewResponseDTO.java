package com.hasini.ai_interview_analyzer.dto;

public class InterviewResponseDTO {
    private String question;
    private String sessionId;
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
