package com.example.pi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${huggingface.api-key}")
    private String hfApiKey;

    private static final String HF_URL =
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // =========================================================
    // MAIN METHOD
    // =========================================================
    public CvAnalysisResult analyzeCv(String cvText, String jobDescription) {

        String prompt = buildPrompt(cvText, jobDescription);

        String response = callHuggingFace(prompt);

        return parseAnalysis(response);
    }

    // =========================================================
    // HUGGINGFACE API CALL
    // =========================================================
    private String callHuggingFace(String prompt) {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.setBearerAuth(hfApiKey);

        Map<String, Object> body = Map.of(
                "inputs", prompt,
                "parameters", Map.of(
                        "max_new_tokens", 700,
                        "temperature", 0.2,
                        "return_full_text", false
                )
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        try {

            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            HF_URL,
                            entity,
                            String.class
                    );

            JsonNode root = mapper.readTree(response.getBody());

            if (root.isArray() && root.size() > 0) {

                return root.get(0)
                        .path("generated_text")
                        .asText();
            }

            return root.toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "HuggingFace API Error: " + e.getMessage()
            );
        }
    }

    // =========================================================
    // PROMPT
    // =========================================================
    private String buildPrompt(String cvText, String jobDescription) {

        return """
                <s>[INST]
                You are an expert ATS recruiter.

                Analyze this CV.

                Return ONLY valid JSON.

                JSON format:
                {
                  "score": 0,
                  "level": "",
                  "summary": "",
                  "strengths": [],
                  "weaknesses": [],
                  "missingSkills": [],
                  "recommendations": [],
                  "keywordsMatched": [],
                  "experienceMatch": "",
                  "educationMatch": ""
                }

                CV:
                %s

                Job Description:
                %s
                [/INST]
                """.formatted(
                cvText,
                jobDescription != null
                        ? jobDescription
                        : "General position"
        );
    }

    // =========================================================
    // PARSE JSON
    // =========================================================
    private CvAnalysisResult parseAnalysis(String raw) {

        try {

            int start = raw.indexOf("{");
            int end = raw.lastIndexOf("}");

            if (start != -1 && end != -1) {

                raw = raw.substring(start, end + 1);
            }

            return mapper.readValue(
                    raw,
                    CvAnalysisResult.class
            );

        } catch (Exception e) {

            return CvAnalysisResult.fallback(raw);
        }
    }

    // =========================================================
    // DTO
    // =========================================================
    @Data
    public static class CvAnalysisResult {

        private int score;

        private String level;

        private String summary;

        private List<String> strengths;

        private List<String> weaknesses;

        private List<String> missingSkills;

        private List<String> recommendations;

        private List<String> keywordsMatched;

        private String experienceMatch;

        private String educationMatch;

        public static CvAnalysisResult fallback(String raw) {

            CvAnalysisResult r =
                    new CvAnalysisResult();

            r.score = 0;

            r.level = "Unknown";

            r.summary =
                    "Could not parse AI response";

            r.strengths = List.of();

            r.weaknesses = List.of();

            r.missingSkills = List.of();

            r.recommendations = List.of();

            r.keywordsMatched = List.of();

            r.experienceMatch = "Unknown";

            r.educationMatch = "Unknown";

            return r;
        }
    }
}