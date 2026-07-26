package com.hasini.ai_interview_analyzer.controller;
import com.hasini.ai_interview_analyzer.service.AIService;
import com.hasini.ai_interview_analyzer.dto.InterviewResponseDTO;
import com.hasini.ai_interview_analyzer.dto.InterviewSessionDTO;
import com.hasini.ai_interview_analyzer.dto.InterviewRequestDTO;
import com.hasini.ai_interview_analyzer.dto.AnswerRequestDTO;
import com.hasini.ai_interview_analyzer.dto.PdfDownloadDTO;
import com.hasini.ai_interview_analyzer.dto.RoadmapTopicDTO;
import com.hasini.ai_interview_analyzer.dto.AnswerResponseDTO;
import com.hasini.ai_interview_analyzer.dto.SkillProgressDTO;
import com.hasini.ai_interview_analyzer.service.ResumeService;
import com.hasini.ai_interview_analyzer.service.EmailService;
import com.hasini.ai_interview_analyzer.repository.ResumeAnalysisRepository;
import com.hasini.ai_interview_analyzer.repository.InterviewHistoryRepository;
import com.hasini.ai_interview_analyzer.service.InterviewPdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.hasini.ai_interview_analyzer.model.InterviewHistory;
import com.hasini.ai_interview_analyzer.model.ResumeAnalysis;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AIController {
    @Autowired
    private AIService aiService;
    @Autowired
    private ResumeService resumeService;
    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;
    @Autowired
    private InterviewHistoryRepository interviewHistoryRepository;
    @Autowired
    private InterviewPdfService interviewPdfService;
    @Autowired
    private EmailService emailService;


    @PostMapping("/startInterview")
    public InterviewResponseDTO startInterview(@RequestBody InterviewRequestDTO request) {

        String sessionId = UUID.randomUUID().toString();

        List<RoadmapTopicDTO> roadmap =
                aiService.generateInterviewRoadmap(request);

        InterviewSessionDTO session =
                aiService.createSession(
                        sessionId,
                        request,
                        roadmap,
                        request.getUserId()
                );

        String firstQuestion =
                aiService.generateQuestionForTopic(
                        session,
                        roadmap.get(0),
                        "AVERAGE"
                );

        session.getQuestions().add(firstQuestion);

        InterviewResponseDTO response = new InterviewResponseDTO();

        response.setQuestion(firstQuestion);

        response.setSessionId(sessionId);

        return response;
    }

    @PostMapping("/uploadResume")
    public Map<String, String> uploadResume(
            @RequestParam("file") MultipartFile file
    ) {

        String resumeText =
                resumeService.extractResumeText(file);

        Map<String, String> response =
                new HashMap<>();

        response.put("resumeText", resumeText);

        return response;
    }

    @PostMapping("/evaluate")
    public AnswerResponseDTO evaluateAnswer(@RequestBody AnswerRequestDTO request) {

        String result = aiService.evaluateAnswer(request);

        AnswerResponseDTO response = new AnswerResponseDTO();


        response.setScore("8/10");
        response.setFeedback("Good answer but lacks depth.");
        response.setImprovedAnswer("A more structured answer would include...");

        return response;
    }
    @PostMapping("/answer")
    public AnswerResponseDTO submitAnswer(@RequestBody AnswerRequestDTO request) {
        return aiService.evaluateAndNext(request);
    }
    @GetMapping("/history")
    public List<InterviewHistory> getInterviewHistory() {
        return aiService.getInterviewHistory();
    }
    @DeleteMapping("/history/{id}")
    public void deleteInterview(
            @PathVariable Long id
    ) {
        aiService.deleteInterview(id);
    }
    @DeleteMapping("/resume/history/{id}")
    public void deleteResume(
            @PathVariable Long id
    ) {

        resumeService.deleteResume(id);

    }
    @GetMapping("/history/{id}")
    public InterviewHistory getInterviewById(
            @PathVariable Long id
    ) {
        return aiService.getInterviewById(id);
    }
    @GetMapping("/resume-history/user/{userId}")
    public List<ResumeAnalysis> getResumeHistory(
            @PathVariable Long userId
    ) {
        return resumeService.getResumeHistory(userId);
    }
    @GetMapping("/resume-history/{id}")
    public ResumeAnalysis getResumeAnalysis(

            @PathVariable Long id

    ) {

        return resumeService.getResumeAnalysis(id);

    }
    @GetMapping("/skill-gap-count/{userId}")
    public ResponseEntity<?> getSkillGapCount(
            @PathVariable Long userId
    ) {

        int count = resumeService.getSkillGapCount(userId);

        return ResponseEntity.ok(
                Map.of(
                        "skillGapCount", count
                )
        );
    }
    @GetMapping("/resume/download/{id}")
    public ResponseEntity<byte[]> downloadResumeReport(
            @PathVariable Long id
    ) throws Exception {

        PdfDownloadDTO report =
                resumeService.downloadResumeReport(id);

        ResumeAnalysis resume =
                resumeAnalysisRepository.findById(id)
                        .orElseThrow();

        String resumeName = resume.getResumeName()
                .replace(".pdf", "")
                .replace(".docx", "")
                .replaceAll("[^a-zA-Z0-9-_ ]", "");

        String role = resume.getTargetRole()
                .replaceAll("[^a-zA-Z0-9-_ ]", "")
                .replace(" ", "_");

        String fileName = resumeName + "_" + role + "_Analysis.pdf";
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\""
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(report.getPdf());

    }
    @GetMapping("/resume-count")
    public Long getResumeCount(@RequestParam Long userId) {

        return resumeAnalysisRepository.countByUser_Id(userId);

    }
    @GetMapping("/interview-count")
    public Long getInterviewCount(@RequestParam Long userId) {

        return interviewHistoryRepository.countByUserId(userId);

    }
    @GetMapping("/skill-progress")
    public List<SkillProgressDTO> getSkillProgress(

            @RequestParam Long userId,

            @RequestParam String role

    ) {

        // Latest resume
        ResumeAnalysis latestResume =
                resumeAnalysisRepository.findTopByUser_IdOrderByIdDesc(userId);

        if (latestResume == null) {
            return List.of();
        }

        // All resumes having same target role
        List<ResumeAnalysis> resumes =
                resumeAnalysisRepository.findByUser_IdAndTargetRoleOrderByIdAsc(
                        userId,
                        role
                );

        List<SkillProgressDTO> result = new ArrayList<>();

        for (ResumeAnalysis resume : resumes) {

            int ats =
                    resume.getAtsScore() == null ? 0 : resume.getAtsScore();

            int missingSkillsCount = 0;

            if (resume.getMissingSkills() != null &&
                    !resume.getMissingSkills().trim().isEmpty()) {

                missingSkillsCount =
                        resume.getMissingSkills().split("\\n").length;
            }

            int skillReadiness;

            if (missingSkillsCount == 0)
                skillReadiness = 100;
            else if (missingSkillsCount == 1)
                skillReadiness = 90;
            else if (missingSkillsCount == 2)
                skillReadiness = 80;
            else if (missingSkillsCount == 3)
                skillReadiness = 70;
            else if (missingSkillsCount == 4)
                skillReadiness = 60;
            else
                skillReadiness = 50;

            int verdictScore = 70;

            if (resume.getFinalVerdict() != null) {

                String verdict =
                        resume.getFinalVerdict().toLowerCase();

                if (verdict.contains("strong"))
                    verdictScore = 100;
                else if (verdict.contains("good"))
                    verdictScore = 85;
                else if (verdict.contains("average"))
                    verdictScore = 70;
                else if (verdict.contains("weak"))
                    verdictScore = 50;
            }

            double quality =
                    ats * 0.60 +
                            skillReadiness * 0.20 +
                            verdictScore * 0.20;

            String date = resume.getUploadedAt();

            result.add(
                    new SkillProgressDTO(
                            resume.getUploadedAt(),
                            (int)Math.round(quality),
                            resume.getResumeName()
                    )
            );

        }

        return result;

    }
    @GetMapping("/roles/{userId}")
    public List<String> getRoles(
            @PathVariable Long userId
    ) {

        return resumeAnalysisRepository.findDistinctRolesByUserId(userId);

    }
    @GetMapping("/profile-strength/{userId}")
    public Integer getProfileStrength(@PathVariable Long userId) {

        // 1. Get latest resume
        ResumeAnalysis latestResume =
                resumeAnalysisRepository.findTopByUser_IdOrderByIdDesc(userId);

        if (latestResume == null) {
            return 0;
        }

        // 2. Resume Quality Score
        int ats = latestResume.getAtsScore() == null ? 0 : latestResume.getAtsScore();
        int skills = latestResume.getSkillsMatchPercentage() == null ? 0 : latestResume.getSkillsMatchPercentage();
        int keyword = latestResume.getKeywordMatchPercentage() == null ? 0 : latestResume.getKeywordMatchPercentage();

        // 3. Skill Readiness
        int missingSkillsCount = 0;

        if (latestResume.getMissingSkills() != null &&
                !latestResume.getMissingSkills().trim().isEmpty()) {

            missingSkillsCount =
                    latestResume.getMissingSkills().split("\\n").length;
        }

        int skillReadiness;

        if (missingSkillsCount == 0)
            skillReadiness = 100;
        else if (missingSkillsCount == 1)
            skillReadiness = 90;
        else if (missingSkillsCount == 2)
            skillReadiness = 80;
        else if (missingSkillsCount == 3)
            skillReadiness = 70;
        else if (missingSkillsCount == 4)
            skillReadiness = 60;
        else
            skillReadiness = 50;

        int verdictScore = 70;

        String verdict = latestResume.getFinalVerdict();

        if (verdict != null) {

            verdict = verdict.toLowerCase();

            if (verdict.contains("strong"))
                verdictScore = 100;

            else if (verdict.contains("good"))
                verdictScore = 85;

            else if (verdict.contains("average"))
                verdictScore = 70;

            else if (verdict.contains("weak"))
                verdictScore = 50;
        }

        double resumeQuality =
                ats * 0.60 +
                        skillReadiness * 0.20 +
                        verdictScore * 0.20;

        // 4. Find interview done using same resume
        InterviewHistory interview =
                interviewHistoryRepository
                        .findTopByUser_IdAndResumeNameOrderByIdDesc(
                                userId,
                                latestResume.getResumeName()
                        );

        double overall;

        if (interview != null && interview.getTotalScore() != null) {

            double interviewScore =
                    (interview.getTotalScore() / 50.0) * 100;

            overall =
                    resumeQuality * 0.70 +
                            interviewScore * 0.30;

        } else {

            overall = resumeQuality;
        }

        return (int)Math.round(overall);

    }
    @GetMapping("/history/download/{id}")
    public ResponseEntity<byte[]> downloadInterviewReport(
            @PathVariable Long id
    ) throws Exception {

        byte[] pdf =
                interviewPdfService.generateInterviewPdf(id);

        InterviewHistory interview =
                aiService.getInterviewById(id);

        String safeRole =
                interview.getRole()
                        .replaceAll("[^a-zA-Z0-9-_ ]", "");

        String fileName =
                safeRole
                        + "_Interview_Report.pdf";
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\""
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);

    }

}

