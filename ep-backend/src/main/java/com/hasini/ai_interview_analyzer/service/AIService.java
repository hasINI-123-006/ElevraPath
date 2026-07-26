package com.hasini.ai_interview_analyzer.service;
import org.springframework.beans.factory.annotation.Value;
import com.hasini.ai_interview_analyzer.dto.InterviewRequestDTO;
import com.hasini.ai_interview_analyzer.dto.InterviewSessionDTO;
import com.hasini.ai_interview_analyzer.dto.AnswerRequestDTO;
import com.hasini.ai_interview_analyzer.dto.AnswerResponseDTO;
import com.hasini.ai_interview_analyzer.repository.InterviewHistoryRepository;
import com.hasini.ai_interview_analyzer.repository.InterviewQuestionRepository;
import com.hasini.ai_interview_analyzer.model.InterviewHistory;
import com.hasini.ai_interview_analyzer.model.InterviewQuestion;
import com.hasini.ai_interview_analyzer.model.User;
import com.hasini.ai_interview_analyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import com.fasterxml.jackson.databind.JsonNode;
import com.hasini.ai_interview_analyzer.dto.RoadmapTopicDTO;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.Duration;
@Service
public class AIService {
    @Value("${openrouter.api.key}")

    private String apiKey;
    @Autowired
    private UserRepository userRepository;
    private final WebClient webClient;
    private final InterviewHistoryRepository interviewHistoryRepository;
    private final InterviewQuestionRepository questionRepository;
    public AIService(WebClient webClient,
                     InterviewHistoryRepository interviewHistoryRepository,
                     InterviewQuestionRepository questionRepository) {

        this.webClient = webClient;
        this.interviewHistoryRepository = interviewHistoryRepository;
        this.questionRepository = questionRepository;
    }

public String callAI(String prompt) {
    try {

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "openai/gpt-4o-mini");
        requestBody.put("messages", List.of(message));

        Map response = webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(60))
                .retryWhen(
                        reactor.util.retry.Retry.fixedDelay(3, Duration.ofSeconds(2))
                )
                .block();

        List choices = (List) response.get("choices");

        if (choices == null || choices.isEmpty()) {
            return "No AI response generated.";
        }

        Map choice = (Map) choices.get(0);

        Map messageResponse = (Map) choice.get("message");

        return messageResponse.get("content").toString();

    } catch (Exception e) {

        e.printStackTrace();

        return """
{
  "score":"0/10",
  "feedback":"Unable to contact the AI service. Please try again.",
  "improvement":"No evaluation available.",
  "idealAnswer":"Unavailable",
  "followUpNeeded":"NO",
  "nextQuestion":""
}
""";
    }
}

    public List<InterviewHistory> getInterviewHistory() {
        return interviewHistoryRepository.findAll(
                Sort.by(Sort.Direction.DESC, "id")
        );
    }
    public void deleteInterview(Long id) {

        interviewHistoryRepository.deleteById(id);

    }
    public InterviewHistory getInterviewById(Long id) {

        return interviewHistoryRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Interview not found")
                );
    }

    private String extractGeminiResponse(Map response) {

        try {

            List candidates = (List) response.get("candidates");

            Map firstCandidate = (Map) candidates.get(0);

            Map content = (Map) firstCandidate.get("content");

            List parts = (List) content.get("parts");

            Map firstPart = (Map) parts.get(0);

            return firstPart.get("text").toString();

        } catch (Exception e) {

            return "Error parsing Gemini response";
        }
    }
    private String cleanAIText(String text) {

        if (text == null)
            return "";

        text = text.trim();

        if (text.startsWith("["))
            text = text.substring(1);

        if (text.endsWith("]"))
            text = text.substring(0, text.length() - 1);

        return text.trim();
    }

    public String analyzeResume(String resumeText, String jobRole, String jobDescription) {

        String prompt = "Analyze this resume:\n"
                + resumeText
                + "\nJob Role: " + jobRole
                + "\nJob Description: " + jobDescription
                + "\nGive Skills, Missing Skills, and Roadmap.";

        return callAI(prompt);
    }

    public List<String> generateQuestions(InterviewRequestDTO request) {

        String prompt =
                "You are a Senior Software Engineering Interviewer.\n\n"

                        + "Job Role:\n"
                        + request.getJobRole()

                        + "\n\nInterview Type:\n"
                        + request.getType()

                        + "\n\nQuestion Count:\n"
                        + request.getQuestionLimit()

                        + "\n\nResume:\n"
                        + (request.getResumeText() == null ? "" : request.getResumeText())

                        + "\n\nTask:"

                        + "\nCarefully analyze the resume."

                        + "\nIdentify the candidate's strongest projects, technical skills, programming languages, frameworks, databases, tools, internships and certifications."

                        + "\nPrioritize the most important topics for the selected job role."

                        + "\nInternally create an interview roadmap before asking any question."

                        + "\n\nRules:"

                        + "\n1. Cover multiple topics."

                        + "\n2. Do NOT ask multiple questions that mean the same thing."

                        + "\n3. Spread questions across different skills."

                        + "\n4. If Interview Type = PROJECT, prioritize projects but do not stay on one project unless the resume contains only one."

                        + "\n5. If Interview Type = TECHNICAL, prioritize technical concepts mentioned in the resume."

                        + "\n6. If Interview Type = BEHAVIORAL, generate HR and situational questions related to the candidate's background."

                        + "\n7. If the resume contains very few topics, intelligently include fundamental questions relevant to the selected job role."

                        + "\n8. Generate exactly "
                        + request.getQuestionLimit()
                        + " interview questions."

                        + "\n9. Arrange the questions in a logical interview flow."

                        + "\n10. Start with easier questions and gradually increase difficulty."

                        + "\n11. Do NOT repeat the same topic."

                        + "\n12. Cover different skills and projects."

                        + "\n13. Do NOT explain the questions."

                        + "\n14. Do NOT give hints."

                        + "\n15. Return ONLY valid JSON."

                        + "\n\nFormat:"

                        + "\n{"

                        + "\n  \"questions\": ["

                        + "\n    \"Question 1\","

                        + "\n    \"Question 2\","

                        + "\n    \"Question 3\""

                        + "\n  ]"

                        + "\n}";

        String aiResponse = callAI(prompt);

        aiResponse = aiResponse
                .replace("```json", "")
                .replace("```", "")
                .trim();

        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> map;

        try {

            map = mapper.readValue(aiResponse, Map.class);

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

        List<String> questions =
                (List<String>) map.get("questions");

        return questions;
    }
    public List<RoadmapTopicDTO> generateInterviewRoadmap(InterviewRequestDTO request) {

        String prompt =
                "You are an experienced technical interviewer.\n\n"

                        + "Job Role:\n"
                        + request.getJobRole()

                        + "\n\nInterview Type:\n"
                        + request.getType()

                        + "\n\nTotal Questions Required:\n"
                        + request.getQuestionLimit()

                        + "\n\nResume:\n"
                        + (request.getResumeText() == null ? "" : request.getResumeText())

                        + "\n\nYour Task:"

                        + "\nAnalyze BOTH the resume and the selected job role."

                        + "\nThink exactly like an interviewer preparing before the interview starts."

                        + "\nCreate an interview roadmap."

                        + "\nThe roadmap should contain interview topics in the order you would naturally discuss them."

                        + "\n\nA topic may come from:"

                        + "\n• Projects"

                        + "\n• Programming Languages"

                        + "\n• Frameworks"

                        + "\n• Databases"

                        + "\n• Cloud"

                        + "\n• Machine Learning"

                        + "\n• AI"

                        + "\n• Mobile Development"

                        + "\n• DevOps"

                        + "\n• Core CS subjects"

                        + "\n• Internships"

                        + "\n• Certifications"

                        + "\n• Any important resume skill"

                        + "\n\nRoadmap Rules:"

                        + "\n1. The roadmap must feel like a real interview."

                        + "\n2. Start with easier confidence-building topics."

                        + "\n3. Gradually increase technical depth."

                        + "\n4. Group similar technologies into ONE interview topic."

                        + "\n5. Never repeat similar topics."

                        + "\n6. Ignore weak or unimportant resume points."

                        + "\n7. Prioritize skills relevant to the selected Job Role."
                        + "\n7.a Do NOT build the roadmap using only the resume."

                        + "\n7.b Do NOT build the roadmap using only the selected Job Role."

                        + "\n7.c Balance BOTH the resume strengths and the job role expectations."

                        + "\n7.d Resume strengths should receive higher priority."

                        + "\n7.e Missing but essential job-role skills should still appear as beginner or intermediate topics."

                        + "\n7.f Never ask advanced questions about technologies not present in the resume."

                        + "\n7.g If a required technology is missing from the resume, ask only its fundamentals."

                        + "\n8. If Interview Type = PROJECT, prioritize projects first, then supporting technologies."

                        + "\n9. If Interview Type = TECHNICAL, prioritize technical concepts and projects."

                        + "\n10. If Interview Type = BEHAVIORAL, prioritize teamwork, internships, leadership, communication and resume experiences."

                        + "\n11. If an important skill required for the selected Job Role is NOT present in the resume, include ONE roadmap topic for its fundamentals."

                        + "\n12. Every roadmap topic must have a depth."

                        + "\n13. Depth means how many interview questions should be asked for that topic."

                        + "\n14. More important topics should receive larger depth."

                        + "\n15. Small topics should receive depth = 1."

                        + "\n16. Maximum depth for one topic = 3."

                        + "\n17. Sum of all depths MUST equal exactly "
                        + request.getQuestionLimit()

                        + "\n18. Do NOT create more questions than the selected limit."

                        + "\n19. Do NOT hardcode technologies."

                        + "\n20. Use ONLY technologies discovered from the resume or logically required for the selected job role."
                        + "\n21. Think exactly like a real interviewer preparing an interview."

                        + "\n22. The roadmap should naturally transition between resume topics and job-role fundamentals."

                        + "\n23. The candidate should feel that every question is relevant to both their experience and the applied role."

                        + "\n24. Avoid over-focusing on one resume skill if the selected job role requires broader knowledge."

                        + "\n25. Prefer breadth first, then depth on the most important topics."

                        + "\n\nExample only (do NOT copy):"

                        + "\nTopic A -> depth 3"

                        + "\nTopic B -> depth 2"

                        + "\nTopic C -> depth 1"

                        + "\nTotal depth = Selected Question Count"

                        + "\n\nReturn ONLY valid JSON."

                        + "\nFormat:"

                        + "{"

                        + "\"roadmap\":["

                        + "{\"topic\":\"Topic Name\",\"depth\":2}"

                        + "]"

                        + "}";

        String aiResponse = callAI(prompt);

        aiResponse = aiResponse
                .replace("```json", "")
                .replace("```", "")
                .trim();

        ObjectMapper mapper = new ObjectMapper();

        try {

            JsonNode root = mapper.readTree(aiResponse);

            JsonNode roadmapNode = root.get("roadmap");

            List<RoadmapTopicDTO> roadmap = new ArrayList<>();

            for (JsonNode node : roadmapNode) {

                RoadmapTopicDTO topic = new RoadmapTopicDTO();

                topic.setTopic(node.get("topic").asText());

                topic.setDepth(node.get("depth").asInt());

                roadmap.add(topic);
            }

            return roadmap;

        } catch (Exception e) {

            throw new RuntimeException("Roadmap parsing failed", e);

        }
    }
    public String evaluateAnswer(AnswerRequestDTO request) {

        String prompt = "You are an AI interviewer.\n"
                + "Job Role: " + request.getJobRole() + "\n"
                + "Question: " + request.getQuestion() + "\n"
                + "Candidate Answer: " + request.getAnswer() + "\n\n"
                + "Evaluate the answer.\n"
                + "Give:\n"
                + "1. Score out of 10\n"
                + "2. Feedback\n"
                + "3. Better Answer";

        return callAI(prompt);
    }
    public InterviewSessionDTO createSession(String sessionId,
                              InterviewRequestDTO request,
                              List<RoadmapTopicDTO> roadmap,
                              Long userId) {

        InterviewSessionDTO session = new InterviewSessionDTO();

        session.setJobRole(request.getJobRole());
        session.setType(request.getType());
        session.setCurrentQuestion(1);

        session.setQuestions(new ArrayList<>());
        session.setQuestionTopics(new ArrayList<>());
        session.setAnswers(new ArrayList<>());
        session.setTotalScore(0);

        session.setResumeText(request.getResumeText());

        session.setRoadmap(roadmap);

        session.setCurrentRoadmapIndex(0);

        session.setCurrentTopicQuestionCount(0);

        session.setQuestionLimit(request.getQuestionLimit());

        InterviewHistory history = new InterviewHistory();

        history.setRole(request.getJobRole());

        history.setInterviewType(request.getType());
        history.setResumeUsed(request.getResumeUsed());
        history.setResumeName(request.getResumeName());

        history.setTotalScore(0);

        history.setCompletedAt(LocalDateTime.now().toString());

        history.setSummary("");

        history.setStrengths("");

        history.setWeaknesses("");

        history.setRecommendations("");
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        history.setUser(user);

        interviewHistoryRepository.save(history);

        session.setHistoryId(history.getId());

        sessions.put(sessionId, session);
        return session;
    }
    public String generateQuestionForTopic(
            InterviewSessionDTO session,
            RoadmapTopicDTO topic,
            String performance
    ) {
        int difficulty = topic.getCurrentDifficulty();

        String difficultyLevel;

        switch (difficulty) {

            case 1:
                difficultyLevel = "Easy";
                break;

            case 2:
                difficultyLevel = "Medium";
                break;

            default:
                difficultyLevel = "Hard";
        }
        List<String> previousTopicQuestions =
                getQuestionsForCurrentTopic(
                        session,
                        topic.getTopic()
                );

        List<String> previousTopicAnswers =
                getAnswersForCurrentTopic(
                        session,
                        topic.getTopic()
                );

        String prompt =
                "You are an experienced interviewer hiring for the following role.\n\n"

                        + "Job Role:\n"
                        + session.getJobRole()

                        + "\n\nYour responsibility is to conduct a realistic interview for this role."

                        + "\n\nUse BOTH:"

                        + "\n1. Candidate Resume"

                        + "\n2. Selected Job Role"

                        + "\n\nto decide what to ask."

                        + "\n\nCandidate Resume:\n"
                        + session.getResumeText()

                        + "\n\nCurrent Interview Topic:\n"
                        + topic.getTopic()

                        + "\nCurrent Difficulty:\n"
                        + difficultyLevel

                        + "\n\nInterview Type:\n"
                        + session.getType()
                        + "\n\nIMPORTANT INTERVIEW MODE RULES:"

                        + "\nIf Interview Type = BEHAVIORAL:"
                        + "\nIgnore technical implementation."
                        + "\nIgnore architecture."
                        + "\nIgnore debugging."
                        + "\nIgnore APIs."
                        + "\nIgnore algorithms."
                        + "\nUse the resume ONLY to create behavioral questions."

                        + "\nAsk about:"
                        + "\n- teamwork"
                        + "\n- leadership"
                        + "\n- ownership"
                        + "\n- communication"
                        + "\n- challenges"
                        + "\n- decision making"
                        + "\n- conflict resolution"
                        + "\n- learning experiences"

                        + "\nNever ask technical questions."

                        + "\nIf Interview Type = TECHNICAL:"
                        + "\nAsk technical interview questions."

                        + "\nIf Interview Type = PROJECT:"
                        + "\nDeep dive into projects."

                        + "\n\nThis topic should have exactly "
                        + topic.getDepth()
                        + " question(s)."

                        + "\n\nThis is question number "
                        + (session.getCurrentTopicQuestionCount() + 1)
                        + " for this topic."

                        + "\nQuestions already asked for THIS topic:\n"
                        + (previousTopicQuestions.isEmpty()
                        ? "None"
                        : String.join("\n", previousTopicQuestions))

                        + "\n\nCandidate answers for THIS topic:\n"
                        + (previousTopicAnswers.isEmpty()
                        ? "None"
                        : String.join("\n", previousTopicAnswers))
                        + "\nCandidate Performance:\n"
                        + performance

                        + "\n\nRules:"
                        + "\nThe selected Job Role is the PRIMARY objective."

                        + "\nThe resume provides the candidate's background."

                        + "\nEvery question must balance BOTH."

                        + "\nDo not interview only from the resume."

                        + "\nDo not ignore the resume."

                        + "\nIf the current topic exists in the resume, ask resume-specific questions."

                        + "\nIf the current topic is a job-role fundamental that is missing from the resume, ask beginner or intermediate questions."

                        + "\nNever assume experience with technologies not present in the resume."

                        + "\nNever invent projects."

                        + "\nBehave exactly like a real interviewer hiring for this job role."
                        + "\nAdaptive Interview Rules:"

                        + "\nIf Performance = POOR:"

                        + "\nAsk an easier conceptual follow-up."

                        + "\nHelp identify whether the candidate knows the fundamentals."

                        + "\nDo NOT jump to advanced questions."

                        + "\nIf Performance = AVERAGE:"

                        + "\nAsk another question on the same topic with medium difficulty."

                        + "\nProbe deeper."

                        + "\nIf Performance = GOOD:"

                        + "\nAsk one advanced implementation or debugging question."

                        + "\nIf Performance = EXCELLENT:"

                        + "\nDo not waste time."

                        + "\nQuickly finish this topic."

                        + "\nMove to the next important topic."

                        + "\nBehave exactly like a senior interviewer."
                        + "\nQuestion Style Rules:"

                        + "\nIf the candidate demonstrated strong experience on the topic,"

                        + "\nask implementation, optimization, debugging or design questions."

                        + "\nIf the candidate has only basic exposure,"

                        + "\nask conceptual questions."

                        + "\nIf the topic is completely absent from the resume but important for the job role,"

                        + "\nask fundamental interview questions."

                        + "\nNever suddenly ask advanced production-level questions for an unfamiliar technology."

                        + "\n• Ask exactly ONE interview question."

                        + "\n• Never repeat any previous question."

                        + "\n• Ask naturally like a real interviewer."

                        + "\n• Start broad if this is the first question of the topic."

                        + "\n• Increase difficulty gradually as the topic progresses."

                        + "\n• Stay ONLY on the current roadmap topic."

                        + "\nIf Interview Type = PROJECT:"

                        + "\nAnalyze the current project first."

                        + "\nInternally identify the most important technical areas of this project."

                        + "\nExamples include (only when applicable):"

                        + "\nArchitecture"

                        + "\nBackend"

                        + "\nFrontend"

                        + "\nMachine Learning"

                        + "\nDatabase"

                        + "\nAuthentication"

                        + "\nAPI Design"

                        + "\nDeployment"

                        + "\nCloud"

                        + "\nPerformance"

                        + "\nScalability"

                        + "\nSecurity"

                        + "\nDebugging"

                        + "\nSystem Design"

                        + "\nTesting"

                        + "\nChoose ONLY the areas relevant to THIS project."

                        + "\nCreate your own interview roadmap internally."

                        + "\nAsk questions following that roadmap."

                        + "\nDo not expose the roadmap."

                        + "\nDo not repeat categories."

                        + "\nGradually increase difficulty."

                        + "\nBehave exactly like a senior Software Engineer interviewer."

                        + "\nUse previous candidate answers to decide the next follow-up."

                        + "\nIf enough depth has been explored, naturally move to the next important area."

                        + "\nNever restart the project explanation."

                        + "\nReturn ONLY ONE interview question."

                        + "\n• Use technologies present in the resume whenever possible."

                        + "\n• If an important skill required for the selected Job Role is missing from the resume,"
                        + " ask a beginner or fundamental question about that skill instead of assuming experience."

                        + "\n• Do NOT explain the question."

                        + "\n• Do NOT provide hints."
                        + "\nDifficulty Rules:"

                        + "\nIf Difficulty = Easy:"
                        + "\nAsk introductory questions."

                        + "\nFocus on definitions, basic concepts and overview."

                        + "\nDo not ask scenario-based questions."

                        + "\nIf Difficulty = Medium:"
                        + "\nAsk implementation questions."

                        + "\nAsk WHY and HOW."

                        + "\nAsk practical development questions."

                        + "\nIf Difficulty = Hard:"
                        + "\nAsk architecture."

                        + "\nAsk scalability."

                        + "\nAsk optimization."

                        + "\nAsk debugging."

                        + "\nAsk production-level scenario questions."

                        + "\nBehave exactly like an experienced interviewer."
                        + "\n\nInterview Flow Rules:"

                        + "\nIf this is the FIRST question of the topic:"
                        + "\nAsk a broad introductory question."

                        + "\nIf previous questions already exist:"
                        + "\nRead the candidate's previous answers."

                        + "\nGenerate a deeper follow-up."

                        + "\nAvoid repeating the same wording."

                        + "\nIncrease the difficulty naturally."

                        + "\nBehave exactly like a human interviewer."

                        + "\nDo not suddenly switch to another subtopic."

                        + "\nContinue the conversation naturally."

                        + "\nIf the candidate already answered something correctly,"
                        + "\nask WHY, HOW, or WHAT IF."

                        + "\nDo not restart the topic."

                        + "\nDo not ask generic questions already covered."

                        + "\nReturn ONLY the next interview question.";


        return callAI(prompt);
    }
    private List<String> getQuestionsForCurrentTopic(
            InterviewSessionDTO session,
            String topic
    ) {

        List<String> result = new ArrayList<>();

        for (int i = 0; i < session.getQuestionTopics().size(); i++) {

            if (session.getQuestionTopics().get(i).equals(topic)) {

                result.add(session.getQuestions().get(i));

            }

        }

        return result;
    }
    private List<String> getAnswersForCurrentTopic(
            InterviewSessionDTO session,
            String topic
    ) {

        List<String> result = new ArrayList<>();

        for (int i = 0; i < session.getQuestionTopics().size(); i++) {

            if (session.getQuestionTopics().get(i).equals(topic)) {

                if (i < session.getAnswers().size()) {

                    result.add(session.getAnswers().get(i));

                }

            }

        }

        return result;
    }
    public AnswerResponseDTO evaluateAndNext(AnswerRequestDTO request) {

        InterviewSessionDTO session = sessions.get(request.getSessionId());

        if (session == null) {
            throw new RuntimeException("Invalid session");
        }
        session.setLastQuestion(request.getQuestion());
        session.setLastAnswer(request.getAnswer());
        session.getAnswers().add(
                request.getAnswer()
        );

        String evaluationPrompt =
                "You are a strict senior technical interviewer.\n\n"

                        + "Question:\n"
                        + request.getQuestion()

                        + "\n\nCandidate Answer:\n"
                        + request.getAnswer()
                        + "\n\nImportant:"
                        + "\nEvaluate only what the candidate actually said."
                        + "\nDo not assume they used technologies that were never mentioned in resume."
                        + "\nIf project details are missing, mention that as an improvement instead of inventing details."

                        + "\n\nEvaluate honestly."

                        + "\nEvaluate fairly."
                        + "\nBase evaluation ONLY on the candidate's answer."
                        + "\nDo NOT assume technologies, frameworks, APIs, or implementations that were not mentioned in the resume."
                        + "\nDo NOT invent project details."
                        + "\nReward relevant and correct information."
                        + "\nDeduct marks only for missing depth, incorrect concepts, or incomplete explanations."

                        + "\nThe idealAnswer must teach the candidate how to answer in a real interview."

                        + "\nDo NOT write large paragraphs."

                        + "\nUse short sections."

                        + "\nUse bullet points wherever useful."

                        + "\nKeep answers concise and easy to memorize."

                        + "\nThe improvement section should describe the best structure for answering this specific question."
                        + "\n\nScoring Guide:"
                        + "\n9-10 = Excellent interview answer with strong detail."
                        + "\n7-8 = Good answer with minor missing details."
                        + "\n5-6 = Average answer with noticeable gaps."
                        + "\n3-4 = Weak answer with major missing details."
                        + "\n0-2 = Incorrect or mostly irrelevant answer."
                        + "\nAdditional Scoring Rules:"

                        + "\nA very short answer should not score above 4."

                        + "\nAnswers with only keywords and no explanation should score between 2 and 4."

                        + "\nAnswers that contain correct concepts but limited explanation should score between 5 and 6."

                        + "\nTo score above 7, the answer must include explanation, reasoning, examples, or implementation details."

                        + "\nDo not reward short answers simply because the keywords are correct."

                        + "\nBe strict when assigning scores."

                        + "\n\nReturn ONLY JSON."
                        + "\nHow to Improve must be very concise."
                        + "\nUse bullet points."
                        + "\nGive an answer structure the candidate can follow."

                        + "\nIdeal Answer must be formatted."
                        + "\nUse headings and bullet points."
                        + "\nAvoid long paragraphs."
                        + "\nMake it sound like a real interview response."
                        + "\nJob Role:\n"
                        + session.getJobRole()

                        + "\n\nInterview Type:\n"
                        + session.getType()

                        + "\n\nResume:\n"
                        + session.getResumeText()

                        + "\n\nPrevious Questions:\n"
                        + String.join("\n", session.getQuestions())
                        + "\n\nLast Question:\n"
                        + request.getQuestion()

                        + "\n\nCandidate Answer:\n"
                        + request.getAnswer()
                        + "\n\nCurrent Question Number:\n"
                        + session.getCurrentQuestion()

                        + "\n\nQuestions Asked So Far:\n"
                        + session.getQuestions().size()

                        + "\n\nRules:"

                        + "\n1. Behave like a real interviewer."

                        + "\n5. Behave like a real interviewer."

                        + "\n6. Do not stay on the same topic for too long."
                        + "\nAvoid excessive follow-up questions on the same topic."

                        + "\nAfter exploring a topic sufficiently, move to another relevant topic."

                        + "\nDo not spend the entire interview discussing only one subtopic."

                        + "\n7. If interview type is PROJECT, focus mainly on projects from the resume."

                        + "\n8. If interview type is TECHNICAL, focus mainly on technical concepts."

                        + "\n9. If interview type is BEHAVIORAL, focus mainly on HR and situational questions."

                        + "\nThe nextQuestion should be based on the candidate's previous answer when appropriate."

                        + "\nIf enough depth has already been explored, switch to another relevant topic."

                        + "\nDo not ask nearly identical follow-up questions."

                        + "\nFormat:"

                        + "{"

                        + "\"score\":\"x/10\","

                        + "\"feedback\":\"2-3 lines explaining honestly how good or bad the answer is\","

                        + "\"improvement\":\"Step 1: ...\\nStep 2: ...\\nStep 3: ...\\nStep 4: ...\""
                        + "\nThe improvement field MUST be formatted exactly like this:"
                        + "\nStep 1: ..."
                        + "\nStep 2: ..."
                        + "\nStep 3: ..."
                        + "\nStep 4: ..."
                        + "\nEach step must be on a separate line."
                        + "\nDo not combine steps into a paragraph."
                        + "\nDo not use bullets."
                        + "\nDo not use numbering other than Step 1, Step 2, etc."

                        + "\nDo not return all steps in one sentence."
                        + "Example: Start with definition -> explain core concepts -> give example -> explain real-world use case.\","

                        + "\"idealAnswer\":\"A clean interview-ready answer that the candidate can memorize and speak in a real interview. "
                        + "Use short section headings when appropriate. "
                        + "Use bullet points where helpful. "
                        + "\nUse plain text headings."

                        + "\nNo markdown symbols."

                        + "\nKeep sections concise."

                        + "\nThe answer should be easy to memorize and speak."
                        + "Avoid long paragraphs. "
                        + "Keep it concise, structured, and easy to revise.\""
                        + ","

                        + "}";
        String evaluationResult = callAI(evaluationPrompt);
        ObjectMapper mapper = new ObjectMapper();

        evaluationResult = evaluationResult
                .replace("```json", "")
                .replace("```", "")
                .trim();

        Map<String, Object> evaluationMap;

        try {
            if (evaluationResult == null || evaluationResult.isBlank()) {
                throw new RuntimeException("Empty AI response");
            }
            evaluationMap = mapper.readValue(evaluationResult, Map.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        String scoreText =
                evaluationMap.get("score").toString();

        String feedback =
                evaluationMap.get("feedback").toString();

        String improvedAnswer =
                evaluationMap.get("improvement").toString();

        String idealAnswer =
                evaluationMap.get("idealAnswer").toString();

        int numericScore =
                Integer.parseInt(scoreText.replace("/10", ""));
        String performance;

        if (numericScore <= 4) {

            performance = "POOR";

        }
        else if (numericScore <= 7) {

            performance = "AVERAGE";

        }
        else if (numericScore <= 9) {

            performance = "GOOD";

        }
        else {

            performance = "EXCELLENT";

        }

        session.setTotalScore(
                session.getTotalScore() + numericScore
        );


        InterviewHistory interviewHistory =
                interviewHistoryRepository.findById(session.getHistoryId())
                        .orElseThrow(() -> new RuntimeException("Interview not found"));

        InterviewQuestion interviewQuestion = new InterviewQuestion();

        interviewQuestion.setInterviewHistory(interviewHistory);

        interviewQuestion.setQuestion(request.getQuestion());

        interviewQuestion.setCandidateAnswer(request.getAnswer());

        interviewQuestion.setIdealAnswer(idealAnswer);

        interviewQuestion.setFeedback(feedback);

        interviewQuestion.setImprovement(improvedAnswer);

        interviewQuestion.setScore(numericScore);

        questionRepository.save(interviewQuestion);

        RoadmapTopicDTO currentTopic =
                session.getRoadmap().get(session.getCurrentRoadmapIndex());

        session.setCurrentTopicQuestionCount(
                session.getCurrentTopicQuestionCount() + 1
        );
        if (currentTopic.getCurrentDifficulty() < 3) {

            currentTopic.setCurrentDifficulty(
                    currentTopic.getCurrentDifficulty() + 1
            );

        }

        if (numericScore >= 8) {

            if (session.getCurrentTopicQuestionCount() >= Math.max(2, currentTopic.getDepth() - 1)) {

                session.setCurrentRoadmapIndex(
                        session.getCurrentRoadmapIndex() + 1
                );

                session.setCurrentTopicQuestionCount(0);
            }

        }
        else if (numericScore <= 4) {

        }

        else {

            if (session.getCurrentTopicQuestionCount() >= currentTopic.getDepth()) {

                session.setCurrentRoadmapIndex(
                        session.getCurrentRoadmapIndex() + 1
                );

                session.setCurrentTopicQuestionCount(0);
            }

        }

        if (session.getCurrentQuestion() >= session.getQuestionLimit()) {
            String summaryPrompt =
                    "You are a senior interviewer."

                            + "\n\nJob Role:\n"
                            + session.getJobRole()

                            + "\n\nInterview Type:\n"
                            + session.getType()

                            + "\n\nQuestions Asked:\n"
                            + String.join("\n", session.getQuestions())
                            + "\n\nCandidate Answers:\n"
                            + String.join("\n", session.getAnswers())

                            + "\n\nTotal Score:\n"
                            + session.getTotalScore()

                            + "\n\nAnalyze the entire interview."

                            + "\nEvaluate the candidate based on all questions and answers."

                            + "\nIdentify technical strengths."

                            + "\nIdentify weak areas."

                            + "\nProvide realistic recommendations."

                            + "\nDo NOT be overly positive."

                            + "\nBe honest and specific."

                            + "\nReturn ONLY JSON."

                            + "\nFormat:"

                            + "{"

                            + "\"summary\":\"3-5 lines overall interview assessment\","

                            + "\"strengths\":\"Bullet point list of strongest areas\","

                            + "\"weaknesses\":\"Bullet point list of weakest areas\","

                            + "\"recommendations\":\"Specific topics the candidate should study next\""

                            + "}";
            String summaryResult =
                    callAI(summaryPrompt);

            summaryResult = summaryResult
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();
            Map<String, Object> summaryMap;

            try {

                summaryMap =
                        mapper.readValue(summaryResult, Map.class);

            } catch (Exception e) {

                throw new RuntimeException(e);
            }
            String summary =
                    summaryMap.get("summary").toString();

            Object strengthsObj = summaryMap.get("strengths");

            String strengths;

            if (strengthsObj instanceof List<?>) {

                strengths = String.join(
                        "\n• ",
                        ((List<?>) strengthsObj)
                                .stream()
                                .map(Object::toString)
                                .toList()
                );

                strengths = "• " + strengths;

            } else {

                strengths = strengthsObj.toString();

            }

            Object weaknessesObj = summaryMap.get("weaknesses");

            String weaknesses;

            if (weaknessesObj instanceof List<?>) {

                weaknesses = String.join(
                        "\n• ",
                        ((List<?>) weaknessesObj)
                                .stream()
                                .map(Object::toString)
                                .toList()
                );

                weaknesses = "• " + weaknesses;

            } else {

                weaknesses = weaknessesObj.toString();

            }
            Object recommendationsObj = summaryMap.get("recommendations");

            String recommendations;

            if (recommendationsObj instanceof List<?>) {

                recommendations = String.join(
                        "\n• ",
                        ((List<?>) recommendationsObj)
                                .stream()
                                .map(Object::toString)
                                .toList()
                );

                recommendations = "• " + recommendations;

            } else {

                recommendations = recommendationsObj.toString();

            }

            InterviewHistory history =
                    interviewHistoryRepository.findById(session.getHistoryId())
                            .orElseThrow(() -> new RuntimeException("Interview not found"));

            history.setRole(
                    session.getJobRole()
            );

            history.setInterviewType(
                    session.getType()
            );

            history.setTotalScore(
                    session.getTotalScore()
            );

            history.setSummary(
                    summary
            );

            history.setStrengths(
                    cleanAIText(strengths)
            );

            history.setWeaknesses(
                    cleanAIText(weaknesses)
            );

            history.setRecommendations(
                    cleanAIText(recommendations)
            );

            history.setCompletedAt(
                    java.time.LocalDateTime.now().toString()
            );
            interviewHistoryRepository.save(history);

            AnswerResponseDTO response =
                    new AnswerResponseDTO();

            response.setScore(scoreText);

            response.setFeedback(feedback);

            response.setImprovedAnswer(improvedAnswer);

            response.setIdealAnswer(idealAnswer);

            response.setTotalScore(
                    session.getTotalScore()
            );

            response.setInterviewCompleted(true);

            response.setInterviewSummary(summary);

            response.setStrengths(
                    cleanAIText(strengths)
            );

            response.setWeaknesses(
                    cleanAIText(weaknesses)
            );

            response.setRecommendations(
                    cleanAIText(recommendations)
            );

            response.setNextQuestion("Interview Completed");


            return response;
        }
        String nextQuestion = null;

        if (session.getCurrentRoadmapIndex() < session.getRoadmap().size()) {

            RoadmapTopicDTO nextTopic =
                    session.getRoadmap().get(session.getCurrentRoadmapIndex());

            nextQuestion =
                    generateQuestionForTopic(
                            session,
                            nextTopic,
                            performance
                    );

            session.getQuestions().add(nextQuestion);

            session.getQuestionTopics().add(
                    nextTopic.getTopic()
            );

            session.setCurrentQuestion(
                    session.getCurrentQuestion() + 1
            );
        }


        AnswerResponseDTO response = new AnswerResponseDTO();
        response.setScore(scoreText);
        response.setFeedback(feedback);
        response.setImprovedAnswer(improvedAnswer);
        response.setIdealAnswer(idealAnswer);
        response.setNextQuestion(nextQuestion);
        response.setTotalScore(session.getTotalScore());

        return response;
    }

    private final Map<String, InterviewSessionDTO> sessions = new HashMap<>();
}

