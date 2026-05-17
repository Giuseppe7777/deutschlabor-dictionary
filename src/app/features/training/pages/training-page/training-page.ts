import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import {
  getRetryAfterSeconds,
  ProtectedApiFailure,
  resolveProtectedApiFailure,
} from '../../../../core/http/api-error';
import { InterfaceLanguageService } from '../../../../core/i18n/interface-language.service';
import { ReviewWord } from '../../models/words-review.models';
import { TrainingApiService } from '../../services/training-api.service';

type TrainingPageStatus = 'loading' | 'ready' | ProtectedApiFailure;

@Component({
  selector: 'app-training-page',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './training-page.html',
  styleUrl: './training-page.css',
})
export class TrainingPage implements OnInit {
  private readonly trainingApi = inject(TrainingApiService);
  private readonly interfaceLanguageService = inject(InterfaceLanguageService);

  protected readonly status = signal<TrainingPageStatus>('loading');
  protected readonly words = signal<ReviewWord[]>([]);
  protected readonly retryAfterSeconds = signal<number | null>(null);

  protected readonly loginPath = computed(() => [
    '/',
    this.interfaceLanguageService.currentLanguage(),
    'login',
  ]);

  protected readonly registerPath = computed(() => [
    '/',
    this.interfaceLanguageService.currentLanguage(),
    'register',
  ]);

  ngOnInit(): void {
    this.loadWordsForReview();
  }

  protected loadWordsForReview(): void {
    this.status.set('loading');
    this.words.set([]);
    this.retryAfterSeconds.set(null);

    this.trainingApi.getWordsForReview().subscribe({
      next: (response) => {
        this.words.set(response.words);
        this.status.set('ready');
      },
      error: (error) => {
        const failure = resolveProtectedApiFailure(error);

        this.status.set(failure);

        if (failure === 'rate_limited') {
          this.retryAfterSeconds.set(getRetryAfterSeconds(error));
        }
      },
    });
  }
}