import { Component } from '@angular/core';


import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pfefront';





  loginwithGit()
  {
      window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  }

  logout()
  {
// const clientId = 'Ov23li5mLKHDdsWg5LYY';
// const redirectUri = 'http://localhost:8080/login/oauth2/code/github';
// const loginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&prompt=login`;

// window.location.href = loginUrl;
 window.location.href = 'http://localhost:8080/logout';
//   fetch('http://localhost:8080/api/public/logout', {
//     method: 'POST',
//     credentials: 'include'
//   }).then(() => {
//     localStorage.clear();
//   // Redirect manually
//   window.location.href = 'http://localhost:4200';
//   });

  }
}
