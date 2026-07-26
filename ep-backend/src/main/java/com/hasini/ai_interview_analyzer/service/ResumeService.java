package com.hasini.ai_interview_analyzer.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hasini.ai_interview_analyzer.dto.AnalysisResponseDTO;
import com.hasini.ai_interview_analyzer.dto.PdfDownloadDTO;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.hasini.ai_interview_analyzer.model.ResumeAnalysis;
import com.hasini.ai_interview_analyzer.repository.ResumeAnalysisRepository;
import com.hasini.ai_interview_analyzer.repository.UserRepository;
import java.util.List;
import com.hasini.ai_interview_analyzer.model.User;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.io.IOException;

@Service
public class ResumeService {

    @Autowired
    private AIService aiService;
    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;
    @Autowired
    private PdfService pdfService;
    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AnalysisResponseDTO analyzeResume(
            MultipartFile file,
            String jobRole,
            String jobDescription,
            Long userId
    ) {

        try {

            PDDocument document = PDDocument.load(file.getInputStream());

            PDFTextStripper pdfStripper = new PDFTextStripper();

            String resumeText = pdfStripper.getText(document);

            document.close();

            String prompt =

                    "You are a senior technical recruiter, ATS specialist, and hiring manager.\n"

                            + "Analyze the resume brutally honestly.\n"

                            + "Do NOT be polite.\n"

                            + "Do NOT inflate scores.\n"

                            + "Do NOT assume skills that are not explicitly mentioned.\n"

                            + "Judge the resume as if it is competing against thousands of applicants.\n"

                            + "Give realistic ATS and recruiter feedback.\n"

                            + "Point out weaknesses clearly.\n"

                            + "Do not sugarcoat anything.\n\n"

                            + "Target Job Role:\n"
                            + jobRole

                            + "\n\nJob Description:\n"
                            + jobDescription

                            + "\n\nResume Content:\n"
                            + resumeText

                            + "\n\nReturn ONLY raw JSON."
                            + "\nDo not use markdown."
                            + "\nDo not wrap the response inside ```json."
                            + "\nDo not add explanations."

                            + "\n\nFormat:"

                            + "{"

                            + "\"atsScore\": number,"

                            + "\"skillsMatchPercentage\": number,"
                            + "\"keywordMatchPercentage\": number,"

                            + "\"resumeSummary\": \"Write 3-5 lines as recruiter evaluation notes, not as praise\","

                            + "\"topSkills\": [\"skill1\", \"skill2\", \"skill3\"],"

                            + "\"strengths\": [\"strength1\", \"strength2\"],"

                            + "\"weaknesses\": [\"weakness1\", \"weakness2\"],"

                            + "\"missingSkills\": [\"skill1\", \"skill2\"],"
                            + "\"resumeInsights\": [\"...\"],"

                            + "\"checklist\": ["

                            + "{"

                            + "\"item\":\"Checklist Item\","

                            + "\"status\":\"Present\""

                            + "}"

                            + "],"

                            + "\"suggestions\": ["

                            + "{"

                            + "\"priority\":\"High\","

                            + "\"text\":\"Deploy one project to Render.\""

                            + "}"

                            + "],"

                            + "\"hiringDecision\": \"Strong Reject | Reject | Consider | Shortlist\","
                            + "\"finalVerdict\": \"Write a 4-6 line recruiter verdict explaining exactly why this resume would or would not be shortlisted and what changes would significantly improve selection chances.\""

                            + "\"recruiterTip\": \"One concise recruiter tip\""

                            + "}"
                            + "\nThe number of items in each array must be dynamic."

                            + "\nReturn as many items as are genuinely applicable."

                            + "\nDo not force every array to contain the same number of elements."

                            + "\n\nScoring Rules:"
                            + "\n\nHiring Decision Rules:"

                            + "\nStrong Reject = ATS below 45"

                            + "\nReject = ATS 45-60"

                            + "\nConsider = ATS 60-75"

                            + "\nShortlist = ATS above 75"

                            + "\nDecision must be realistic."

                            + "\nATS Score above 85 should be extremely rare."

                            + "\nStudent resumes usually fall between 45 and 75."

                            + "\nPenalize missing internships."

                            + "\nPenalize missing deployment experience."

                            + "\nPenalize lack of measurable achievements."

                            + "\nPenalize generic project descriptions."

                            + "\nPenalize keyword stuffing."

                            + "\nReward strong projects."

                            + "\nReward certifications."

                            + "\nReward relevant technical skills."
                            + "\nReward quantified achievements."
                            + "\n\nTop Skills Rules:"

                            + "\nReturn all important technical skills explicitly found in the resume."

                            + "\nDo not invent skills."

                            + "\nDo not include soft skills."

                            + "\nReturn between 3 and 10 skills depending on the resume."
                            + "\n\nStrengths Rules:"

                            + "\nReturn every meaningful strength found in the resume."

                            + "\nUsually between 3 and 7 strengths."

                            + "\nDo not repeat the same idea."

                            + "\nEach strength should be concise."

                            + "\n\nWeaknesses Rules:"

                            + "\nReturn every important weakness."

                            + "\nUsually between 2 and 6 weaknesses."

                            + "\nFocus on technical, project, ATS and recruiter concerns."

                            + "\nDo not give generic weaknesses."
                            + "\n\nMissing Skills Rules:"

                            + "\nReturn all important missing technical skills."

                            + "\nOnly include skills relevant for the target job."

                            + "\nDo not invent unnecessary skills."
                            + "\n\nResume Insights Rules:"

                            + "\nGive 4-6 recruiter observations."

                            + "\nMention patterns noticed in the resume."

                            + "\nMention strengths and hidden concerns."

                            + "\nDo not repeat strengths or weaknesses."

                            + "\n\nChecklist Rules:"

                            + "\nGenerate a recruiter checklist based on BOTH the target job role and the uploaded resume."

                            + "\nThe checklist must be different for different job roles."

                            + "\nChoose checklist items intelligently."

                            + "\n\nIf the target role is Backend Developer, Full Stack Developer, Java Developer or Software Engineer, prefer checklist items like:"

                            + "\nGitHub"

                            + "\nProjects"

                            + "\nInternship"

                            + "\nDeployment"

                            + "\nREST APIs"

                            + "\nSpring Boot"

                            + "\nDatabase"

                            + "\nCloud"

                            + "\nDocker"

                            + "\nTechnical Skills"

                            + "\nEducation"

                            + "\nCertifications"

                            + "\nAchievements"

                            + "\n\nIf the target role is Data Analyst, Data Scientist or Machine Learning Engineer, prefer checklist items like:"

                            + "\nSQL"

                            + "\nPython"

                            + "\nPower BI"

                            + "\nTableau"

                            + "\nExcel"

                            + "\nStatistics"

                            + "\nMachine Learning"

                            + "\nProjects"

                            + "\nInternship"

                            + "\nGitHub"

                            + "\nEducation"

                            + "\nCertifications"

                            + "\nAchievements"

                            + "\n\nIf the target role is UI Designer, UX Designer or Product Designer, prefer checklist items like:"

                            + "\nPortfolio"

                            + "\nFigma"

                            + "\nAdobe XD"

                            + "\nWireframes"

                            + "\nPrototype"

                            + "\nDesign System"

                            + "\nProjects"

                            + "\nInternship"

                            + "\nCreativity"

                            + "\nEducation"

                            + "\nCertifications"

                            + "\nAchievements"

                            + "\n\nIf the target role is not one of the above, generate a checklist that best matches the role."

                            + "\nReturn ONLY checklist items relevant for the current role."

                            + "\nReturn between 6 and 12 checklist items."

                            + "\nEach checklist item must be returned as:"

                            + "\n{"

                            + "\"item\":\"Checklist Item\","

                            + "\"status\":\"Present\" or \"Missing\""

                            + "}"

                            + "\nMark an item as Present only if it is explicitly supported by the resume."

                            + "\nNever assume skills or experience."

                            + "\nDo not force the same checklist for every resume."

                            + "\n\nPriority Rules:"

                            + "\nEach suggestion must have High, Medium or Low priority."

                            + "\nOnly 1-2 High priorities."

                            + "\nMost improvements should be Medium."

                            + "\nFormatting improvements should usually be Low."
                            + "\n\nRecruiter Tip Rules:"

                            + "\nReturn ONLY one recruiter tip."

                            + "\nThe tip must be specific to THIS resume."

                            + "\nThe tip must be the single highest-impact improvement."

                            + "\nMaximum 20 words."

                            + "\nDo not summarize the resume."

                            + "\nDo not praise the candidate."

                            + "\nStart with an action verb whenever possible."

                            + "\nExamples:"
                            + "\n• Add quantified achievements to every project."
                            + "\n• Deploy at least one full-stack project and include the live link."
                            + "\n• Tailor your skills section to better match the target job description."
                            + "\n• Add Spring Boot experience to strengthen your backend profile."
                            + "\n\nKeyword Match Percentage Rules:"

                            + "\nEvaluate how many important keywords from the target job role and job description"

                            + "\nappear naturally inside the resume."

                            + "\nDo NOT reward keyword stuffing."

                            + "\nScore based on relevant technologies, programming languages, frameworks,"

                            + "\nlibraries, databases, cloud platforms, tools, methodologies, and domain-specific terms."

                            + "\nHigher scores should only be given when the resume genuinely demonstrates"

                            + "\nexperience or projects involving those keywords."

                            + "\nTypical Scoring Guide:"

                            + "\n30-50 = Poor"

                            + "\n50-70 = Average"

                            + "\n70-85 = Good"

                            + "\n85-100 = Excellent"
                            + "\n\nSuggestions Rules:"

                            + "\nReturn actionable recommendations."

                            + "\nOrder recommendations from highest priority to lowest priority."

                            + "\nFirst fix critical resume issues."

                            + "\nThen recommend technical skills."

                            + "\nThen recommend optional improvements."

                            + "\nDo not give generic advice."

                            + "\nReturn as many recommendations as necessary.";

            String aiResponse = aiService.callAI(prompt);
            if (aiResponse.contains("\"score\"") && aiResponse.contains("\"feedback\"")) {
                throw new RuntimeException("AI failed to generate resume analysis.");
            }
            aiResponse = aiResponse
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();


            if (!aiResponse.trim().startsWith("{")) {
                throw new RuntimeException(
                        "AI returned invalid response: " + aiResponse
                );
            }

            AnalysisResponseDTO response =
                    objectMapper.readValue(
                            aiResponse,
                            AnalysisResponseDTO.class
                    );

            ResumeAnalysis analysis = new ResumeAnalysis();

            analysis.setResumeName(file.getOriginalFilename());

            analysis.setTargetRole(jobRole);

            analysis.setJobDescription(jobDescription);

            analysis.setAtsScore(response.getAtsScore());

            analysis.setSkillsMatchPercentage(response.getSkillsMatchPercentage());

            analysis.setKeywordMatchPercentage(response.getKeywordMatchPercentage());

            analysis.setResumeSummary(response.getResumeSummary());

            analysis.setRecruiterTip(response.getRecruiterTip());

            analysis.setHiringDecision(response.getHiringDecision());

            analysis.setUploadedAt(
                    LocalDateTime.now()
                            .format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"))
            );

            analysis.setStrengths(
                    String.join("\n", response.getStrengths())
            );

            analysis.setWeaknesses(
                    String.join("\n", response.getWeaknesses())
            );

            analysis.setTopSkills(
                    String.join("\n", response.getTopSkills())
            );

            analysis.setMissingSkills(
                    String.join("\n", response.getMissingSkills())
            );
            analysis.setResumeInsights(

                    String.join(
                            "\n",
                            response.getResumeInsights()
                    )

            );
            analysis.setChecklist(

                    response.getChecklist()
                            .stream()
                            .map(c -> c.getItem() + "|" + c.getStatus())
                            .collect(java.util.stream.Collectors.joining("\n"))

            );

            analysis.setSuggestions(

                    response.getSuggestions()
                            .stream()
                            .map(s -> s.getPriority() + "|" + s.getText())
                            .collect(java.util.stream.Collectors.joining("\n"))

            );
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            analysis.setUser(user);
            resumeAnalysisRepository.save(analysis);

            return response;

        } catch (IOException e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Failed to process resume analysis"
            );
        }
    }
    public ResumeAnalysis getResumeAnalysis(Long id) {

        return resumeAnalysisRepository
                .findById(id)
                .orElseThrow();

    }
    public PdfDownloadDTO downloadResumeReport(Long id) throws Exception {

        ResumeAnalysis resume =
                resumeAnalysisRepository
                        .findById(id)
                        .orElseThrow();

        byte[] pdf =
                pdfService.generateResumeReport(resume);

        String fileName =
                resume.getResumeName();

        if(fileName.endsWith(".pdf")){

            fileName =
                    fileName.substring(
                            0,
                            fileName.length()-4
                    );

        }

        fileName =
                fileName + "_Analysis.pdf";

        return new PdfDownloadDTO(
                pdf,
                fileName
        );

    }
    public String extractResumeText(MultipartFile file) {

        try {

            PDDocument document =
                    PDDocument.load(file.getInputStream());

            PDFTextStripper pdfStripper =
                    new PDFTextStripper();

            String resumeText =
                    pdfStripper.getText(document);

            document.close();

            return resumeText;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to extract resume text"
            );
        }
    }
    public List<ResumeAnalysis> getResumeHistory(Long userId) {

        return resumeAnalysisRepository
                .findByUser_IdOrderByIdDesc(userId);

    }
    public void deleteResume(Long id) {

        resumeAnalysisRepository.deleteById(id);

    }
    public int getSkillGapCount(Long userId) {

        ResumeAnalysis latestResume =
                resumeAnalysisRepository.findTopByUser_IdOrderByIdDesc(userId);

        if (latestResume == null) {
            return 0;
        }

        String missingSkills = latestResume.getMissingSkills();

        if (missingSkills == null || missingSkills.isBlank()) {
            return 0;
        }

        return (int) missingSkills
                .lines()
                .filter(line -> !line.trim().isEmpty())
                .count();
    }
}
