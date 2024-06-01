import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorService } from '../services/changeDetector/change-detector.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss',
})
export class ProfileButtonComponent implements OnInit, OnDestroy {
  changeToSave: boolean = false;
  private changeSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private changeDetector: ChangeDetectorService
  ) {}

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

  showProfile() {
    if (this.changeToSave) {
      this.changeDetector.mustSaveChanges();
    }
    this.router.navigateByUrl('/home/profile');
  }
}
