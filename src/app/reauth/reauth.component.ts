import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-reauth',
  templateUrl: './reauth.component.html',
  styleUrl: './reauth.component.scss',
})
export class ReauthComponent {
  newPassword: string | undefined;
  loginPassword: string | undefined;
  errormessage: string | undefined;
  newPasswordRepeat: string | undefined;
  successmessage : string | undefined;

  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    this.authService
      .changePassword(form.value.password, form.value.newPassword)
      .subscribe({
        next: () => {
          this.successmessage = 'Passwort erfolgreich geändert.'
        },
        error: (err) => {
          if(err.code !== 'auth/missing-password'){
            this.errormessage = 'Änderung des Passworts fehlgeschlagen. Versuchen Sie es später erneut';
          } else{
            console.log(err)
            this.errormessage = 'Das alte Passwort ist falsch.';
          }
        },
      });
  }
}
