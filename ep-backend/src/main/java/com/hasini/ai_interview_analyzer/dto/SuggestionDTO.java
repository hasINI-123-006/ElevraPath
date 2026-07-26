package com.hasini.ai_interview_analyzer.dto;

public class SuggestionDTO {

    private String priority;
    private String text;

    public SuggestionDTO() {}

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}