package com.example.pi.controller;

import com.example.pi.service.AiService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.net.URL;

@RestController
@RequestMapping("/api/cv")
@CrossOrigin(origins = "http://localhost:4200")
public class CvAnalyzerController {

    private final AiService aiService;

    public CvAnalyzerController(
            AiService aiService
    ) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeCv(

            @RequestParam("cvUrl")
            String cvUrl,

            @RequestParam(
                    value = "jobDescription",
                    required = false
            )
            String jobDescription
    ) {

        try {

            URL url =
                    new URL(cvUrl);

            InputStream inputStream =
                    url.openStream();

            PDDocument document =
                    PDDocument.load(inputStream);

            PDFTextStripper stripper =
                    new PDFTextStripper();

            String text =
                    stripper.getText(document);

            document.close();

            return ResponseEntity.ok(

                    aiService.analyzeCv(
                            text,
                            jobDescription
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}