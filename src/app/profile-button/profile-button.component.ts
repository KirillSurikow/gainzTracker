import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss'
})
export class ProfileButtonComponent {
    constructor(private router : Router){}
    showProfile(){
       this.router.navigateByUrl('/home/profile')
    }
}
