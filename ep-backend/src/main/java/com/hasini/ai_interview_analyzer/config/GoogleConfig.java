package com.hasini.ai_interview_analyzer.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GoogleConfig {

    @Value("${google.client.id}")
    private String clientId;

    public String getClientId() {
        return clientId;
    }
}