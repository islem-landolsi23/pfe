import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
   private loggedInSubject = new BehaviorSubject<boolean>(false);
  constructor(private http :HttpClient) { 
 // this.checkLoginStatus();
 this.checkSession()
    
  }

  // login() {
  //   this.isLoggedInSignal.set(true);
  // }
   loginWithGitHub() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  }
  // logout() {
  //   this.isLoggedInSignal.set(false);
  // }

  // isAuthenticated() {
  //   return this.isLoggedInSignal();
  // }

 
  // private checkLoginStatus() {
  //   this.http.get('http://localhost:8080/api/public/me', { withCredentials: true }).subscribe({
  //     next: () => this.loggedIn.next(true),
  //     error: () => this.loggedIn.next(false),
  //   });
  // }

   checkSession(): Observable<boolean> {
    return this.http.get('http://localhost:8080/api/public/me', { withCredentials: true }).pipe(
      tap(() => this.loggedInSubject.next(true)),
      map(() => true),
      catchError(() => {
        this.loggedInSubject.next(false);
        return of(false);
      })
    );
  }
   isLoggedIn(): boolean {
  //  return this.loggedIn.value; // synchronous boolean
   return this.loggedInSubject.value;
  }
    

   logout() {
    window.location.href = 'http://localhost:8080/logout';
    
  }
}
