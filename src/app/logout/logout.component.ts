import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ChangeDetectorService } from '../services/changeDetector/change-detector.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private changeDetector: ChangeDetectorService
  ) {}

  changeToSave: boolean = false;
  private changeSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.changeSubscription = this.changeDetector.changeEvent.subscribe(
      (change) => {
        this.changeToSave = change;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.changeSubscription) {
      this.changeSubscription?.unsubscribe();
    }
  }

  logout() {
    // if (this.changeToSave) {
    //   this.changeDetector.mustSaveChanges();
    // }
    this.authService.logout();
  }
}
