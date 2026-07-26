package com.hasini.ai_interview_analyzer.model;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "resume_analysis")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resumeName;

    private String targetRole;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    private Integer atsScore;

    private Integer skillsMatchPercentage;

    private Integer keywordMatchPercentage;

    @Column(columnDefinition = "TEXT")
    private String resumeSummary;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String weaknesses;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;
    @Column(columnDefinition = "TEXT")
    private String resumeInsights;

    @Column(columnDefinition = "TEXT")
    private String checklist;

    @Column(columnDefinition = "TEXT")
    private String topSkills;

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    @Column(columnDefinition = "TEXT")
    private String recruiterTip;

    private String hiringDecision;

    private String uploadedAt;
    private String finalVerdict;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")

    @JsonIgnore
    private User user;

    public ResumeAnalysis() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    public String getFinalVerdict() {
        return finalVerdict;
    }

    public void setFinalVerdict(String finalVerdict) {
        this.finalVerdict = finalVerdict;
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public Integer getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(Integer atsScore) {
        this.atsScore = atsScore;
    }

    public Integer getSkillsMatchPercentage() {
        return skillsMatchPercentage;
    }

    public void setSkillsMatchPercentage(Integer skillsMatchPercentage) {
        this.skillsMatchPercentage = skillsMatchPercentage;
    }

    public Integer getKeywordMatchPercentage() {
        return keywordMatchPercentage;
    }

    public void setKeywordMatchPercentage(Integer keywordMatchPercentage) {
        this.keywordMatchPercentage = keywordMatchPercentage;
    }

    public String getResumeSummary() {
        return resumeSummary;
    }

    public void setResumeSummary(String resumeSummary) {
        this.resumeSummary = resumeSummary;
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

    public String getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(String missingSkills) {
        this.missingSkills = missingSkills;
    }
    public String getResumeInsights() {
        return resumeInsights;
    }

    public void setResumeInsights(String resumeInsights) {
        this.resumeInsights = resumeInsights;
    }

    public String getChecklist() {
        return checklist;
    }

    public void setChecklist(String checklist) {
        this.checklist = checklist;
    }

    public String getTopSkills() {
        return topSkills;
    }

    public void setTopSkills(String topSkills) {
        this.topSkills = topSkills;
    }

    public String getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(String suggestions) {
        this.suggestions = suggestions;
    }

    public String getRecruiterTip() {
        return recruiterTip;
    }

    public void setRecruiterTip(String recruiterTip) {
        this.recruiterTip = recruiterTip;
    }

    public String getHiringDecision() {
        return hiringDecision;
    }

    public void setHiringDecision(String hiringDecision) {
        this.hiringDecision = hiringDecision;
    }

    public String getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(String uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}