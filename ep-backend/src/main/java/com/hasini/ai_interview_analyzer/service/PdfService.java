package com.hasini.ai_interview_analyzer.service;

import com.hasini.ai_interview_analyzer.model.ResumeAnalysis;
import com.itextpdf.text.*;
import java.util.Arrays;
import com.hasini.ai_interview_analyzer.dto.SuggestionDTO;
import com.hasini.ai_interview_analyzer.dto.ChecklistDTO;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generateResumeReport(ResumeAnalysis resume) throws Exception {

        Document document = new Document(PageSize.A4);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);

        document.open();
        Font titleFont =
                new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD);

        Paragraph title =
                new Paragraph("Resume Analysis Report", titleFont);

        title.setAlignment(Element.ALIGN_CENTER);

        title.setSpacingAfter(25);

        document.add(title);
        Font heading =
                new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);

        Font normal =
                new Font(Font.FontFamily.HELVETICA, 11);

        document.add(new Paragraph("Target Role", heading));
        document.add(new Paragraph(resume.getTargetRole(), normal));

        document.add(new Paragraph("Resume Name", heading));
        document.add(new Paragraph(resume.getResumeName(), normal));

        document.add(Chunk.NEWLINE);
        PdfPTable scoreTable = new PdfPTable(3);

        scoreTable.setWidthPercentage(100);

        scoreTable.setSpacingBefore(10);

        scoreTable.setSpacingAfter(20);

        scoreTable.setWidths(new float[]{1,1,1});

        Font scoreTitle =
                new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);

        Font scoreValue =
                new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);

        PdfPCell atsCell = new PdfPCell();

        atsCell.setPadding(12);

        atsCell.addElement(new Paragraph("ATS Score", scoreTitle));

        atsCell.addElement(
                new Paragraph(
                        resume.getAtsScore() + "%",
                        scoreValue
                )
        );

        PdfPCell skillCell = new PdfPCell();

        skillCell.setPadding(12);

        skillCell.addElement(new Paragraph("Skills Match", scoreTitle));

        skillCell.addElement(
                new Paragraph(
                        resume.getSkillsMatchPercentage() + "%",
                        scoreValue
                )
        );

        PdfPCell keywordCell = new PdfPCell();

        keywordCell.setPadding(12);

        keywordCell.addElement(new Paragraph("Keyword Match", scoreTitle));

        keywordCell.addElement(
                new Paragraph(
                        resume.getKeywordMatchPercentage() + "%",
                        scoreValue
                )
        );

        scoreTable.addCell(atsCell);

        scoreTable.addCell(skillCell);

        scoreTable.addCell(keywordCell);

        document.add(scoreTable);
        document.add(new Paragraph("Resume Summary", heading));

        document.add(
                new Paragraph(
                        resume.getResumeSummary(),
                        normal
                )
        );

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("Strengths", heading));

        com.itextpdf.text.List strengthList =
                new com.itextpdf.text.List(com.itextpdf.text.List.UNORDERED);

        for (String strength : parseList(resume.getStrengths())) {

            strengthList.add(new ListItem(strength, normal));

        }

        document.add(strengthList);

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("Areas to Improve", heading));

        com.itextpdf.text.List weaknessList =
                new com.itextpdf.text.List(com.itextpdf.text.List.UNORDERED);

        for (String weakness : parseList(resume.getWeaknesses())) {

            weaknessList.add(new ListItem(weakness, normal));

        }

        document.add(weaknessList);

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("Top Skills", heading));

        Paragraph skills = new Paragraph("", normal);

        for (String skill : parseList(resume.getTopSkills())) {

            skills.add(skill + "   ");

        }

        document.add(skills);

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("Missing Skills", heading));

        Paragraph missing = new Paragraph("", normal);

        for (String skill : parseList(resume.getMissingSkills())) {

            missing.add(skill + "   ");

        }

        document.add(missing);

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("Resume Insights", heading));

        com.itextpdf.text.List pdfInsightList =
                new com.itextpdf.text.List(com.itextpdf.text.List.UNORDERED);

        java.util.List<String> insights =
                parseList(resume.getResumeInsights());

        for(String item : insights){

            pdfInsightList.add(new ListItem(item, normal));

        }

        document.add(pdfInsightList);

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("Recruiter Checklist", heading));

        java.util.List<ChecklistDTO> checklist =
                parseChecklist(resume.getChecklist());

        PdfPTable checklistTable = new PdfPTable(2);

        checklistTable.setWidthPercentage(100);

        checklistTable.setSpacingBefore(10);

        checklistTable.setWidths(new float[]{3,1});

        Font tableHeader =
                new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);

        checklistTable.addCell(new PdfPCell(new Phrase("Item", tableHeader)));
        checklistTable.addCell(new PdfPCell(new Phrase("Status", tableHeader)));

        for (ChecklistDTO c : checklist) {

            checklistTable.addCell(c.getItem());

            String status =
                    c.getStatus().equalsIgnoreCase("Present")
                            ? "✔ Present"
                            : "✖ Missing";

            checklistTable.addCell(status);

        }

        document.add(checklistTable);

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("Recommendations", heading));

        java.util.List<SuggestionDTO> suggestions =
                parseSuggestions(resume.getSuggestions());

        for (SuggestionDTO s : suggestions) {

            Font priorityFont;

            switch (s.getPriority()) {

                case "High":
                    priorityFont =
                            new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, BaseColor.RED);
                    break;

                case "Medium":
                    priorityFont =
                            new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, BaseColor.ORANGE);
                    break;

                default:
                    priorityFont =
                            new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, BaseColor.GREEN);

            }

            Paragraph recommendation = new Paragraph();

            recommendation.add(
                    new Chunk(
                            "[" + s.getPriority() + "] ",
                            priorityFont
                    )
            );

            recommendation.add(
                    new Chunk(
                            s.getText(),
                            normal
                    )
            );

            recommendation.setSpacingAfter(6);

            document.add(recommendation);

        }

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("AI Recruiter Tip", heading));

        document.add(
                new Paragraph(
                        resume.getRecruiterTip(),
                        normal
                )
        );

        document.add(Chunk.NEWLINE);

        Paragraph footer = new Paragraph(
                "Generated by AI Interview Analyzer",
                new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC)
        );

        footer.setAlignment(Element.ALIGN_CENTER);

        footer.setSpacingBefore(25);

        document.add(footer);

        document.close();

        return out.toByteArray();

    }
    private java.util.List<String> parseList(String text) {

        if (text == null || text.isBlank()) {
            return java.util.List.of();
        }

        return Arrays.stream(text.split("\\n"))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

    }

    private java.util.List<SuggestionDTO> parseSuggestions(String text) {

        if (text == null || text.isBlank()) {
            return java.util.List.of();
        }

        java.util.List<SuggestionDTO> result =
                new java.util.ArrayList<>();

        String[] lines = text.split("\\n");

        for(String line : lines){

            String[] parts = line.split("\\|",2);

            SuggestionDTO dto = new SuggestionDTO();

            dto.setPriority(parts[0]);

            dto.setText(parts.length>1 ? parts[1] : "");

            result.add(dto);

        }

        return result;

    }

    private java.util.List<ChecklistDTO> parseChecklist(String text) {

        if (text == null || text.isBlank()) {
            return java.util.List.of();
        }

        java.util.List<ChecklistDTO> result =
                new java.util.ArrayList<>();

        String[] lines = text.split("\\n");

        for(String line : lines){

            String[] parts = line.split("\\|",2);

            ChecklistDTO dto = new ChecklistDTO();

            dto.setItem(parts[0]);

            dto.setStatus(parts.length>1 ? parts[1] : "");

            result.add(dto);

        }

        return result;

    }

}

