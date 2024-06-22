import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { DbService } from '../db/db.service';
import {
  signOut,
  getAuth,
  sendPasswordResetEmail,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private db: DbService) {}
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);

  register(
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    )
      .then((response) => {
        const uid = response.user.uid;
        updateProfile(response.user, { displayName: username });
        this.db.setUserInDB(uid, email, username, firstName, lastName);
      })
      .then(() => {
        if (this.auth.currentUser) {
          sendEmailVerification(this.auth.currentUser);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});

    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  private auth = getAuth();
  async resetPassword(email: string): Promise<any> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return 'success';
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  updateUsername(newUsername: string) {
    if (this.auth.currentUser) {
      updateProfile(this.auth.currentUser, { displayName: newUsername })
        .then(() => {
          if (this.auth.currentUser) {
            this.db.updateUser(
              this.auth.currentUser?.uid,
              'username',
              newUsername
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  update_Email(newEmail: string) {
    if (this.auth.currentUser) {
      updateEmail(this.auth.currentUser, newEmail)
        .then(() => {
          if (this.auth.currentUser) {
            sendEmailVerification(this.auth.currentUser);
          }
        })
        .then(() => {
          if (this.auth.currentUser) {
            this.db.updateUser(this.auth.currentUser?.uid, 'email', newEmail);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  changePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<void | undefined> {
    if (this.auth.currentUser?.email) {
      const credentials = EmailAuthProvider.credential(
        this.auth.currentUser?.email,
        oldPassword
      );
      if (this.auth.currentUser) {
        const promise = reauthenticateWithCredential(
          this.auth.currentUser,
          credentials
        ).then(() => {
          if (this.auth.currentUser) {
            updatePassword(this.auth.currentUser, newPassword)
              .then(() => {})
              .catch((error: any) => {
                console.dir(error.code);
              });
          }
        });
        return from(promise);
      }
    }
    return of(undefined);
  }

  delete_user(oldPassword: string): Observable<void | undefined> {
    if (this.auth.currentUser?.email) {
      const credentials = EmailAuthProvider.credential(
        this.auth.currentUser?.email,
        oldPassword
      );
      if (this.auth.currentUser) {
        const promise = reauthenticateWithCredential(
          this.auth.currentUser,
          credentials
        ).then(() => {
          if (this.auth.currentUser) {
            deleteUser(this.auth.currentUser)
              .then(() => {
                this.db.deleteUser(this.auth.currentUser?.uid);
              })
              .catch((error: any) => {
                console.dir(error.code);
              });
          }
        });
        return from(promise);
      }
    }
    return of(undefined);
  }
}
