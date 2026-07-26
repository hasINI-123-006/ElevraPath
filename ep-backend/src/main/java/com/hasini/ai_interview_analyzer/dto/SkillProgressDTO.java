package com.hasini.ai_interview_analyzer.dto;

public class SkillProgressDTO {

    private String date;
    private Integer score;
    private String resumeName;

    public SkillProgressDTO() {
    }

    public SkillProgressDTO(String date, Integer score,String resumeName) {
        this.date = date;
        this.score = score;
        this.resumeName = resumeName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}