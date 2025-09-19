import { Component, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Panel } from 'primeng/panel';
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [Button, InputText, Panel, FormsModule, Toast],
  providers: [MessageService],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.scss'
})
export class LoginformComponent {

  email!: string;
  password!: string;
  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }
  loginWithGit() {

    this.authService.loginWithGitHub()
  }

  logout() {


    this.authService.logout();
  }


  login() {

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/kanban');
      }, error: (err) => {
        this.showError("verify email and password")
      }
    })
  }
  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}
