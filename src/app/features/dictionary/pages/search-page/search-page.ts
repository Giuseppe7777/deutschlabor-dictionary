import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search-page',
  imports: [TranslatePipe],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage {}
