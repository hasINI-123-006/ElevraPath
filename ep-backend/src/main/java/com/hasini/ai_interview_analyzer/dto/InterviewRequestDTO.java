package com.hasini.ai_interview_analyzer.dto;

public class InterviewRequestDTO {
    private String type; // behavioral / technical / project
    private String resumeText;
    private String jobRole;
    private String jobDescription;
    private Long userId;
    private Boolean resumeUsed;
    private String resumeName;
    private Integer questionLimit;
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
    public Boolean getResumeUsed() {
        return resumeUsed;
    }

    public void setResumeUsed(Boolean resumeUsed) {
        this.resumeUsed = resumeUsed;
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }
    public Integer getQuestionLimit() {
        return questionLimit;
    }

    public void setQuestionLimit(Integer questionLimit) {
        this.questionLimit = questionLimit;
    }
}
