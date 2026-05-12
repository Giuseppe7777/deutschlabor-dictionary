import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login-page',
  imports: [TranslatePipe],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {}
