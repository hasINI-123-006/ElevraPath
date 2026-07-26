package com.hasini.ai_interview_analyzer.dto;

public class RoadmapTopicDTO {

    private String topic;

    private int depth;
    private int currentDifficulty = 1;

    public RoadmapTopicDTO() {
    }

    public RoadmapTopicDTO(String topic, int depth) {
        this.topic = topic;
        this.depth = depth;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public int getDepth() {
        return depth;
    }

    public void setDepth(int depth) {
        this.depth = depth;
    }
    public int getCurrentDifficulty() {
        return currentDifficulty;
    }

    public void setCurrentDifficulty(int currentDifficulty) {
        this.currentDifficulty = currentDifficulty;
    }
}