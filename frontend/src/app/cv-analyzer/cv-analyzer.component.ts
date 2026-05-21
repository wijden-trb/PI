import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AiService, CvAnalysisResult } from '../services/ai.service';

@Component({
  selector: 'app-cv-analyzer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cv-analyzer.component.html',
  styleUrls: ['./cv-analyzer.component.css']
})
export class CvAnalyzerComponent {

  private extractApi = 'http://localhost:8081/api/cv/extract-text';

  cvUrl = '';
  jobDesc = '';
  loading = false;
  errorMessage = '';
  result: CvAnalysisResult | null = null;

  constructor(
    private http: HttpClient,
    private aiService: AiService
  ) {}

  analyze(): void {
    if (!this.cvUrl.trim()) {
      this.errorMessage = 'Please enter CV URL';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.result = null;

    this.http.post<any>(
      this.extractApi,
      null,
      { params: { cvUrl: this.cvUrl } }
    ).subscribe({
      next: (res) => {
        const cvText = res.text;
        this.aiService.analyzeCv(cvText, this.jobDesc).subscribe({
          next: (analysis) => {
            this.result = analysis;
            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
            this.errorMessage = 'AI analysis failed';
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'CV extraction failed';
      }
    });
  }

  reset(): void {
    this.cvUrl = '';
    this.jobDesc = '';
    this.result = null;
    this.errorMessage = '';
  }

  getScoreColor(): string {
    const score = this.result?.score || 0;
    if (score >= 75) return '#22c55e'; // green
    if (score >= 50) return '#f59e0b'; // orange
    return '#ef4444'; // red
  }

  getCircleDash(): string {
    const circumference = 2 * Math.PI * 45; // r=45
    const filled = ((this.result?.score ?? 0) / 100) * circumference;
    return `${filled} ${circumference}`;
  }

  getLevelClass(): string {
    if (!this.result) return '';
    const map: Record<string, string> = {
      Excellent: 'badge-excellent',
      Good: 'badge-good',
      Average: 'badge-average',
      Weak: 'badge-weak'
    };
    return map[this.result.level] ?? '';
  }
}
