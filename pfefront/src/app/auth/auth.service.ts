import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
   private loggedInSubject = new BehaviorSubject<boolean>(false);
     private emailSubject = new BehaviorSubject<any>(null); // Initial value
      public currentEmail: Observable<string> = this.emailSubject.asObservable();
  constructor(private http :HttpClient) { 
 // this.checkLoginStatus();
 this.checkSession()
    
  }

   loginWithGitHub() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  }


   checkSession(): Observable<boolean> {


    if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.loggedInSubject.next(true);
      return of(true);
    }
  }

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

   return this.loggedInSubject.value;
  }
    

   logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('email'); // or wherever you store it
// router.navigate(['/login']);
this.changeData(null);
    window.location.href = 'http://localhost:8080/logout';
    
  }

  login(email: string, password: string) {
  return this.http.post<{ token: string }>(`http://localhost:8080/api/login`, { email, password })
    .pipe(
      tap(res => {
        localStorage.setItem('jwt', res.token);
         localStorage.setItem('email', email);
         this.changeData(email)

      })
    );
}

   changeData(email: any) {
        this.emailSubject.next(email);
      }
}
