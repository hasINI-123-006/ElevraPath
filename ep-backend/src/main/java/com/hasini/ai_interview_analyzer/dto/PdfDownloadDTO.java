package com.hasini.ai_interview_analyzer.dto;

public class PdfDownloadDTO {

    private final byte[] pdf;

    private final String fileName;

    public PdfDownloadDTO(byte[] pdf, String fileName) {
        this.pdf = pdf;
        this.fileName = fileName;
    }

    public byte[] getPdf() {
        return pdf;
    }

    public String getFileName() {
        return fileName;
    }
}