import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation } from '../models/evaluation.model';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private readonly apiUrl = 'http://localhost:8081/api/evaluations';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(this.apiUrl);
  }

  create(payload: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, payload);
  }

  update(id: number, payload: Evaluation): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
