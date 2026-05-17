export interface ReviewWord {
  id: number;
  sourceLanguage: string;
  targetLanguage: string;
  word: string;
  translation?: string;
  nextReviewAt?: string | null;
}

export interface WordsReviewResponse {
  words: ReviewWord[];
}