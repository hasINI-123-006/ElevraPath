package com.hasini.ai_interview_analyzer.dto;

public class ChecklistDTO {

    private String item;
    private String status;

    public ChecklistDTO() {}

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}