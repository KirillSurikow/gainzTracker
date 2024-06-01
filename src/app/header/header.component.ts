import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorService } from '../services/changeDetector/change-detector.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
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
    if(this.changeSubscription){
      this.changeSubscription?.unsubscribe();
    }
}

  goToMain() {
    if (this.changeToSave) {
      this.changeDetector.mustSaveChanges();
    }
    this.router.navigateByUrl('/home');
  }
}
