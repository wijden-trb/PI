import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface CvAnalysisResult {

  score: number;

  level: string;

  summary: string;

  strengths: string[];

  weaknesses: string[];

  missingSkills: string[];

  recommendations: string[];

  keywordsMatched: string[];

  experienceMatch: string;

  educationMatch: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiUrl =
    'http://localhost:8081/api/ai/analyze';

  constructor(private http: HttpClient) {}

  analyzeCv(
    cvText: string,
    jobDescription: string
  ): Observable<CvAnalysisResult> {

    return this.http.post<CvAnalysisResult>(
      this.apiUrl,
      {
        cvText,
        jobDescription
      }
    );
  }
}
