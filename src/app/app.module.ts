import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './header/header.component';
import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AngularFireModule } from '@angular/fire/compat';
import { LogoutComponent } from './logout/logout.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProfileButtonComponent } from './profile-button/profile-button.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PreventHoverDirective } from './directives/preventHover/prevent-hover.directive';
import { ReauthComponent } from './reauth/reauth.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { ChooseExerciseComponent } from './choose-exercise/choose-exercise.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ManageWorkoutsComponent } from './manage-workouts/manage-workouts.component';
import { NameWorkoutComponent } from './dialogs/nameWorkout/name-workout/name-workout.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelectAndExecuteWOComponent } from './select-and-execute-wo/select-and-execute-wo.component';
import { ExecuteWorkoutComponent } from './execute-workout/execute-workout.component';
import { DatePipe } from '@angular/common';
import { TimerComponent } from './timer/timer.component';
import { TimeFormatPipe } from './pipes/time-format';
import { TimerAndStoppWatchComponent } from './timer-and-stopp-watch/timer-and-stopp-watch.component';
import { ProgressComponent } from './progress/progress.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartComponent } from './chart/chart.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SignUpComponent,
    ForgetPasswordComponent,
    HomeComponent,
    LogoutComponent,
    ProfileButtonComponent,
    ProfileComponent,
    DashboardComponent,
    PreventHoverDirective,
    ReauthComponent,
    DeleteUserComponent,
    ChooseExerciseComponent,
    ManageWorkoutsComponent,
    NameWorkoutComponent,
    SelectAndExecuteWOComponent,
    ExecuteWorkoutComponent,
    TimerComponent,
    TimeFormatPipe,
    TimerAndStoppWatchComponent,
    ProgressComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    DragDropModule,


  ],
  providers: [
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    DatePipe,
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
