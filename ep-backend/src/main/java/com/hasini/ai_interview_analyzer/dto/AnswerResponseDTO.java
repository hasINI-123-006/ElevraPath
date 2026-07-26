package com.hasini.ai_interview_analyzer.dto;

public class AnswerResponseDTO {
    private String score;
    private String feedback;
    private String improvedAnswer;
    private String idealAnswer;
    private String nextQuestion;
    private int totalScore;

    private boolean interviewCompleted;
    private String interviewSummary;
    private String strengths;
    private String weaknesses;
    private String recommendations;

    public String getScore() { return score; }
    public void setScore(String score) { this.score = score; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getImprovedAnswer() { return improvedAnswer; }
    public void setImprovedAnswer(String improvedAnswer) { this.improvedAnswer = improvedAnswer; }

    public String getNextQuestion() { return nextQuestion; }
    public void setNextQuestion(String nextQuestion) { this.nextQuestion = nextQuestion; }

    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
    public String getIdealAnswer() {
        return idealAnswer;
    }
    public void setIdealAnswer(String idealAnswer) {
        this.idealAnswer = idealAnswer;
    }
    public boolean isInterviewCompleted() {
        return interviewCompleted;
    }
    public void setInterviewCompleted(boolean interviewCompleted) {
        this.interviewCompleted = interviewCompleted;
    }
    public String getInterviewSummary() {
        return interviewSummary;
    }

    public void setInterviewSummary(String interviewSummary) {
        this.interviewSummary = interviewSummary;
    }

    public String getStrengths() {
        return strengths;
    }

    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }

    public String getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(String weaknesses) {
        this.weaknesses = weaknesses;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

}
