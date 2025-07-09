import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { PrimeIcons } from 'primeng/api';
import { Menubar, MenubarModule } from 'primeng/menubar';
import { Ripple } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule,RouterOutlet,NgIf,
    ButtonModule,MenubarModule ,Menubar,
     BadgeModule, AvatarModule, InputTextModule,
      Ripple],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
     items: MenuItem[] | undefined;
  title = 'pfefront';
  isDropdownOpen = false;

constructor(private authService: AuthService){}
  ngOnInit(): void {
          this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home',
            },
              {
                label: 'Profile',
                icon: 'pi pi-user',
            },
            {
                label: 'Projects',
                icon: 'pi pi-briefcase',
               
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                        shortcut: '⌘+S',
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server',
                        shortcut: '⌘+B',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil',
                        shortcut: '⌘+U',
                    },
                ],
            },
            {
              label:"Forum",
               icon: 'pi pi-hashtag'
              
            },{
                label:"Notifications",
               icon: 'pi pi-bell',
                badge : "2"
            },{
               label:"Messages",
               icon: 'pi pi-envelope',
                badge : "2",
            }
        ];
  }



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
