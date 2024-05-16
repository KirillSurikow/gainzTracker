import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss'
})
export class DeleteUserComponent {
  loginPassword : string | undefined;
  errormessage : string | undefined;

  constructor(private authService: AuthService, private router : Router){}

  onSubmit(form: NgForm){
        this.authService
      .delete_user(form.value.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('login')
        },
        error: (err) => {
          if(err.code !== 'auth/invalid-credential'){
            this.errormessage = 'Löschen des Benutzers fehlgeschlagen';
          } else{
            console.log(err)
            this.errormessage = 'Das Passwort ist falsch.';
          }
        },
      });
  }
}
