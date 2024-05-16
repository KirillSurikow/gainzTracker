import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/dataservice/data.service';
import { AuthService } from '../services/auth/auth.service';
import { DbService } from '../services/db/db.service';
import { User } from '../interfaces/user';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: User | undefined | null;
  userNameInputToggled: boolean = false;
  firstNameInputToggled: boolean = false;
  lastNameInputToggled: boolean = false;
  emailInputToggled: boolean = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private db: DbService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.user = this.dataService.user;
    window.document
      .getElementById('startScreenWrapper')
      ?.addEventListener('click', () => this.closeAll());
  }

  toggleEdit(e: MouseEvent, toggledPosition: string) {
    e.stopPropagation();
    if (toggledPosition === 'userNameInputToggled') {
      this.userNameInputToggled = !this.userNameInputToggled;
    }
    if (toggledPosition === 'firstNameInputToggled') {
      this.firstNameInputToggled = !this.firstNameInputToggled;
    }
    if (toggledPosition === 'lastNameInputToggled') {
      this.lastNameInputToggled = !this.lastNameInputToggled;
    }
    if (toggledPosition === 'emailInputToggled') {
      this.emailInputToggled = !this.emailInputToggled;
    }
  }

  closeAll() {
    this.userNameInputToggled = false;
    this.firstNameInputToggled = false;
    this.lastNameInputToggled = false;
    this.emailInputToggled = false;
  }

  goToChangePassword(e: MouseEvent) {
    e.stopPropagation();
    this.router.navigateByUrl('/home/changePassword')
  }

  goToDeleteUser(e: MouseEvent) {
    e.stopPropagation();
    this.router.navigateByUrl('/home/deleteUser')
  }

  update(property: string, input: NgModel) {
    if (property === 'username' && this.user) {
      this.user.username = input.value;
      if (this.dataService.user?.username) {
        this.dataService.user.username = input.value;
      }
      this.authService.updateUsername(input.value);
    }
    if (property === 'email' && this.user) {
      this.user.email = input.value;
      if (this.dataService.user?.email) {
        this.dataService.user.email = input.value;
      }
      this.authService.update_Email(input.value);
    }
    if (property === 'email' && this.user) {
      this.user.email = input.value;
      if (this.dataService.user?.email) {
        this.dataService.user.email = input.value;
      }
      this.authService.update_Email(input.value);
    }
    if (property === 'firstName' && this.user) {
      this.user.firstName = input.value;
      if (this.dataService.user?.firstName) {
        this.dataService.user.firstName = input.value;
      }
      this.db.updateUser(this.user.uid, 'firstName', input.value);
    }
    if (property === 'lastName' && this.user) {
      this.user.lastName = input.value;
      if (this.dataService.user?.lastName) {
        this.dataService.user.lastName = input.value;
      }
      this.db.updateUser(this.user.uid, 'lastName', input.value);
    }
  }
}
