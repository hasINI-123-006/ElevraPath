package com.hasini.ai_interview_analyzer.dto;

public class ProfileStrengthDTO {

    private int overallScore;

    public ProfileStrengthDTO() {}

    public ProfileStrengthDTO(int overallScore) {
        this.overallScore = overallScore;
    }

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }
}
