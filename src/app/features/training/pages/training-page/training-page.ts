import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-training-page',
  imports: [TranslatePipe],
  templateUrl: './training-page.html',
  styleUrl: './training-page.css',
})
export class TrainingPage {}
