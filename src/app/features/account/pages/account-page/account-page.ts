import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-account-page',
  imports: [TranslatePipe],
  templateUrl: './account-page.html',
  styleUrl: './account-page.css',
})
export class AccountPage {}
