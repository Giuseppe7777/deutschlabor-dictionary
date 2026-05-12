import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register-page',
  imports: [TranslatePipe],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {}
