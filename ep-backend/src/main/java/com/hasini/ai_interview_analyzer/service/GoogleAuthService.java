package com.hasini.ai_interview_analyzer.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.hasini.ai_interview_analyzer.config.GoogleConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {

    @Autowired
    private GoogleConfig googleConfig;

    public GoogleIdToken.Payload verifyToken(String credential) throws Exception {

        GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(
                        new NetHttpTransport(),
                        GsonFactory.getDefaultInstance()
                )
                        .setAudience(
                                Collections.singletonList(
                                        googleConfig.getClientId()
                                )
                        )
                        .build();

        GoogleIdToken idToken =
                verifier.verify(credential);

        if (idToken == null) {
            throw new RuntimeException("Invalid Google Token");
        }

        return idToken.getPayload();
    }
}