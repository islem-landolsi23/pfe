import { Component, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Panel } from 'primeng/panel';
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router';
@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [Button,InputText,Panel,FormsModule],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.scss'
})
export class LoginformComponent {

  email!: string;
   password!: string;
constructor(private authService: AuthService,private router: Router) {}
loginWithGit()
  {
 
   this.authService.loginWithGitHub()
  }

    logout()
  {


 this.authService.logout();
  }


login()
{

  this.authService.login(this.email,this.password).subscribe(res=>{
     this.router.navigateByUrl('/kanban');
  })
}
  
}
