package com.hasini.ai_interview_analyzer.service;

import com.hasini.ai_interview_analyzer.model.InterviewHistory;
import com.hasini.ai_interview_analyzer.model.InterviewQuestion;
import com.hasini.ai_interview_analyzer.repository.InterviewHistoryRepository;
import com.hasini.ai_interview_analyzer.repository.InterviewQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Element;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.util.List;
@Service
public class InterviewPdfService {

    @Autowired
    private InterviewHistoryRepository interviewRepository;

    @Autowired
    private InterviewQuestionRepository interviewQuestionRepository;

    public byte[] generateInterviewPdf(Long interviewId) throws Exception {

        InterviewHistory interview =
                interviewRepository.findById(interviewId)
                        .orElseThrow();

        List<InterviewQuestion> questions =
                interviewQuestionRepository.findByInterviewHistoryId(interviewId);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4);

        PdfWriter.getInstance(document, out);

        document.open();
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD);

        Paragraph title = new Paragraph("Interview Report", titleFont);

        title.setAlignment(Element.ALIGN_CENTER);

        document.add(title);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Role : " + interview.getRole()));

        document.add(new Paragraph("Interview Type : " + interview.getInterviewType()));

        document.add(new Paragraph("Completed At : " + interview.getCompletedAt()));

        document.add(new Paragraph("Score : "
                + interview.getTotalScore()
                + "/50"));

        document.add(new Paragraph(" "));
        Font heading = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);

        document.add(new Paragraph("Overall Summary", heading));

        document.add(new Paragraph(interview.getSummary()));

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Strengths", heading));

        for (String s : interview.getStrengths().split("\n")) {

            document.add(new Paragraph("• " + s));

        }

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Areas to Improve", heading));

        for (String s : interview.getWeaknesses().split("\n")) {

            document.add(new Paragraph("• " + s));

        }

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Recommendations", heading));

        document.add(new Paragraph(interview.getRecommendations()));

        document.add(new Paragraph(" "));
        document.newPage();

        document.add(new Paragraph("Interview Questions", titleFont));

        document.add(new Paragraph(" "));
        for (int i = 0; i < questions.size(); i++) {

            InterviewQuestion q = questions.get(i);

            Font questionTitle =
                    new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.BLUE);

            document.add(
                    new Paragraph(
                            "Question " + (i + 1),
                            questionTitle
                    )
            );

            document.add(new Paragraph(" "));

            Font subHeading =
                    new Font(Font.FontFamily.HELVETICA, 13, Font.BOLD);


            document.add(new Paragraph("Interview Question", subHeading));

            document.add(new Paragraph(q.getQuestion()));

            document.add(new Paragraph(" "));

            document.add(new Paragraph("Your Answer", subHeading));

            document.add(new Paragraph(q.getCandidateAnswer()));

            document.add(new Paragraph(" "));

            document.add(new Paragraph("Score", subHeading));

            document.add(new Paragraph(q.getScore() + "/10"));

            document.add(new Paragraph(" "));

            document.add(new Paragraph("Ideal Answer", subHeading));

            document.add(new Paragraph(q.getIdealAnswer()));

            document.add(new Paragraph(" "));

            document.add(new Paragraph("AI Feedback", subHeading));

            document.add(new Paragraph(q.getFeedback()));

            document.add(new Paragraph(" "));

            document.add(new Paragraph("How to Improve", subHeading));

            document.add(new Paragraph(q.getImprovement()));

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "------------------------------------------------------------"
            ));

            document.add(new Paragraph(" "));

        }
        document.close();

        return out.toByteArray();
    }

}
