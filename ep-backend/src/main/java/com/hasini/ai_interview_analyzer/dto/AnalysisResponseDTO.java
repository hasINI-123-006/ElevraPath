
package com.hasini.ai_interview_analyzer.dto;

import java.util.List;

public class AnalysisResponseDTO {

    private int atsScore;

    private int skillsMatchPercentage;

    private String resumeSummary;

    private List<String> strengths;

    private List<String> weaknesses;

    private List<String> missingSkills;

    private String recruiterTip;
    private String hiringDecision;
    private List<String> topSkills;
    private int keywordMatchPercentage;
    private List<String> resumeInsights;
    private String finalVerdict;

    private List<SuggestionDTO> suggestions;

    private List<ChecklistDTO> checklist;
    public String getFinalVerdict() {
        return finalVerdict;
    }

    public void setFinalVerdict(String finalVerdict) {
        this.finalVerdict = finalVerdict;
    }

    public int getKeywordMatchPercentage() {
        return keywordMatchPercentage;
    }

    public void setKeywordMatchPercentage(int keywordMatchPercentage) {
        this.keywordMatchPercentage = keywordMatchPercentage;
    }
    public List<String> getTopSkills() {
        return topSkills;
    }

    public void setTopSkills(List<String> topSkills) {
        this.topSkills = topSkills;
    }

    public int getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(int atsScore) {
        this.atsScore = atsScore;
    }

    public int getSkillsMatchPercentage() {
        return skillsMatchPercentage;
    }

    public void setSkillsMatchPercentage(int skillsMatchPercentage) {
        this.skillsMatchPercentage = skillsMatchPercentage;
    }

    public String getResumeSummary() {
        return resumeSummary;
    }

    public void setResumeSummary(String resumeSummary) {
        this.resumeSummary = resumeSummary;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getResumeInsights() {
        return resumeInsights;
    }

    public void setResumeInsights(List<String> resumeInsights) {
        this.resumeInsights = resumeInsights;
    }

    public List<SuggestionDTO> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<SuggestionDTO> suggestions) {
        this.suggestions = suggestions;
    }

    public List<ChecklistDTO> getChecklist() {
        return checklist;
    }

    public void setChecklist(List<ChecklistDTO> checklist) {
        this.checklist = checklist;
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
}
