import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { WordsReviewResponse } from '../models/words-review.models';

@Injectable({
  providedIn: 'root',
})
export class TrainingApiService {
  private readonly http = inject(HttpClient);

  getWordsForReview() {
    return this.http.get<WordsReviewResponse>('/api/words/review');
  }
}