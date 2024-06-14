// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReauthComponent } from './reauth/reauth.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { ChooseExerciseComponent } from './choose-exercise/choose-exercise.component';
import { ManageWorkoutsComponent } from './manage-workouts/manage-workouts.component';
import { SelectAndExecuteWOComponent } from './select-and-execute-wo/select-and-execute-wo.component';
import { ExecuteWorkoutComponent } from './execute-workout/execute-workout.component';
import { ProgressComponent } from './progress/progress.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'changePassword', component: ReauthComponent},
      { path: 'deleteUser', component: DeleteUserComponent},
      { path: 'chooseExercise', component: ChooseExerciseComponent},
      { path: 'workouts', component: ManageWorkoutsComponent},
      { path: 'startWorkout', component: SelectAndExecuteWOComponent},
      { path: 'executeWorkout', component: ExecuteWorkoutComponent},
      { path: 'progress', component: ProgressComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
