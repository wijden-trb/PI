import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EvaluationService } from '../../services/evaluation.service';
import { Evaluation } from '../../models/evaluation.model';

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evaluations.component.html',
  styleUrl: './evaluations.component.css',
})
export class EvaluationsComponent implements OnInit {
  evaluations: Evaluation[] = [];
  editingId: number | null = null;
  errorMessage = '';

  readonly evaluationForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly evaluationService: EvaluationService
  ) {
    this.evaluationForm = this.fb.nonNullable.group({
      studentName: ['', [Validators.required]],
      enterpriseName: ['', [Validators.required]],
      projectTitle: ['', [Validators.required]],
      rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: [''],
      projectDate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadEvaluations();
  }

  loadEvaluations(): void {
    this.evaluationService.getAll().subscribe({
      next: (data) => {
        this.evaluations = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = "Impossible de charger les evaluations.";
      },
    });
  }

  submit(): void {
    if (this.evaluationForm.invalid) {
      this.evaluationForm.markAllAsTouched();
      return;
    }

    const payload: Evaluation = this.evaluationForm.getRawValue();

    if (this.editingId === null) {
      this.evaluationService.create(payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadEvaluations();
        },
        error: (err) => {
          this.errorMessage = err?.error || 'Echec de creation.';
        },
      });
      return;
    }

    this.evaluationService.update(this.editingId, payload).subscribe({
      next: () => {
        this.resetForm();
        this.loadEvaluations();
      },
      error: (err) => {
        this.errorMessage = err?.error || 'Echec de mise a jour.';
      },
    });
  }

  startEdit(evaluation: Evaluation): void {
    if (!evaluation.id) {
      return;
    }
    this.editingId = evaluation.id;
    this.evaluationForm.patchValue({
      studentName: evaluation.studentName,
      enterpriseName: evaluation.enterpriseName,
      projectTitle: evaluation.projectTitle,
      rating: evaluation.rating,
      comment: evaluation.comment ?? '',
      projectDate: evaluation.projectDate,
    });
  }

  remove(id?: number): void {
    if (!id) {
      return;
    }
    this.evaluationService.delete(id).subscribe({
      next: () => this.loadEvaluations(),
      error: () => (this.errorMessage = 'Echec de suppression.'),
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.evaluationForm.reset({
      studentName: '',
      enterpriseName: '',
      projectTitle: '',
      rating: 1,
      comment: '',
      projectDate: '',
    });
  }
}
