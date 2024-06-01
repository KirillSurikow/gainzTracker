import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { DbService } from './services/db/db.service';
import { Router } from '@angular/router';
import { DataService } from './services/dataservice/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'gainzTracker';
  loggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private db: DbService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(async (user) => {
      if (user) {
        const userData = await this.db.getUserData(user.uid);
        if (userData) {
          if (!this.dataService.user) {
            let obj = {
              email: userData['email'],
              firstName: userData['firstName'],
              lastName: userData['lastName'],
              uid: userData['uid'],
              username: userData['username'],
              workoutPlans: userData['workoutPlans']
            };
            this.dataService.storeUserData(obj);
          }
          this.loggedIn = true;
          this.router.navigateByUrl('/home');
        }
      } else if (!user && this.router.url == '/signUp') {
        this.router.navigateByUrl('/signUp');
        this.loggedIn = false;
      } else if (!user && this.router.url == '/forgetPassword') {
        this.router.navigateByUrl('/forgetPassword');
        this.loggedIn = false;
      } else {
        this.router.navigateByUrl('/login');
        this.loggedIn = false;
      }
    });
  }
}
