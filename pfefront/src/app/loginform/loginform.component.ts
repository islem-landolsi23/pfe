import { Component, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.scss'
})
export class LoginformComponent {
constructor(private authService: AuthService) {}
loginWithGit()
  {
   //   window.location.href = 'http://localhost:8080/oauth2/authorization/github';
   this.authService.loginWithGitHub()
  }

    logout()
  {
   // window.location.href = 'http://localhost:8080/logout';

 this.authService.logout();
  }


//  get isLoggedIn(): boolean {
//     return this.authService.isLoggedIn();
//   }
  
}
