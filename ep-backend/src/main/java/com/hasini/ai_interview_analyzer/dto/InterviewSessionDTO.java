package com.hasini.ai_interview_analyzer.dto;
import java.util.List;
import java.util.ArrayList;
public class InterviewSessionDTO {
    private String jobRole;
    private String type;
    private int currentQuestion;
    private List<String> questions;
    private List<String> questionTopics = new ArrayList<>();
    private int totalScore;
    private String resumeText;

    private String jobDescription;

    private List<String> answers;
    private String lastAnswer;
    private String lastQuestion;
    private Long historyId;
    private List<RoadmapTopicDTO> roadmap = new ArrayList<>();

    private int currentRoadmapIndex = 0;

    private int currentTopicQuestionCount = 0;
    private Integer questionLimit;

    public Long getHistoryId() {
        return historyId;
    }

    public void setHistoryId(Long historyId) {
        this.historyId = historyId;
    }

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getCurrentQuestion() { return currentQuestion; }
    public void setCurrentQuestion(int currentQuestion) { this.currentQuestion = currentQuestion; }

    public List<String> getQuestions() { return questions; }
    public void setQuestions(List<String> questions) { this.questions = questions; }

    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }
    public String getLastAnswer() {
        return lastAnswer;
    }

    public void setLastAnswer(String lastAnswer) {
        this.lastAnswer = lastAnswer;
    }

    public String getLastQuestion() {
        return lastQuestion;
    }

    public void setLastQuestion(String lastQuestion) {
        this.lastQuestion = lastQuestion;
    }
    public Integer getQuestionLimit() {
        return questionLimit;
    }

    public void setQuestionLimit(Integer questionLimit) {
        this.questionLimit = questionLimit;
    }
    public List<RoadmapTopicDTO> getRoadmap() {
        return roadmap;
    }

    public void setRoadmap(List<RoadmapTopicDTO> roadmap) {
        this.roadmap = roadmap;
    }

    public int getCurrentRoadmapIndex() {
        return currentRoadmapIndex;
    }

    public void setCurrentRoadmapIndex(int currentRoadmapIndex) {
        this.currentRoadmapIndex = currentRoadmapIndex;
    }

    public int getCurrentTopicQuestionCount() {
        return currentTopicQuestionCount;
    }

    public void setCurrentTopicQuestionCount(int currentTopicQuestionCount) {
        this.currentTopicQuestionCount = currentTopicQuestionCount;
    }
    public List<String> getQuestionTopics() {
        return questionTopics;
    }

    public void setQuestionTopics(List<String> questionTopics) {
        this.questionTopics = questionTopics;
    }
}
