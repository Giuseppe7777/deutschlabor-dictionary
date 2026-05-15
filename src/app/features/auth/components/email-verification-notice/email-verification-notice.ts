import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-email-verification-notice',
  imports: [TranslatePipe],
  templateUrl: './email-verification-notice.html',
  styleUrl: './email-verification-notice.css',
})
export class EmailVerificationNotice {
  private readonly authState = inject(AuthStateService);

  readonly isVisible = this.authState.isEmailUnverified;
}