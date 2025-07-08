import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { log } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet,NgIf,ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pfefront';
  isDropdownOpen = false;

constructor(private authService: AuthService){}



  loginwithGit()
  {
     // window.location.href = 'http://localhost:8080/oauth2/authorization/github';
     this.authService.loginWithGitHub()
  }

  logout()
  {
     this.authService.logout();
// const clientId = 'Ov23li5mLKHDdsWg5LYY';
// const redirectUri = 'http://localhost:8080/login/oauth2/code/github';
// const loginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&prompt=login`;

// window.location.href = loginUrl;
 //window.location.href = 'http://localhost:8080/logout';
//   fetch('http://localhost:8080/api/public/logout', {
//     method: 'POST',
//     credentials: 'include'
//   }).then(() => {
//     localStorage.clear();
//   // Redirect manually
//   window.location.href = 'http://localhost:4200';
//   });

  }

  checkislogged()
  {
    console.log( this.authService.isLoggedIn())  

  }

   toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log(this.isDropdownOpen )
  }
}
