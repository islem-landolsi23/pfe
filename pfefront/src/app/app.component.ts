import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { PrimeIcons } from 'primeng/api';
import { Menubar, MenubarModule } from 'primeng/menubar';
import { Ripple } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CallService } from './service/call.service';
import { AudiocallComponent } from './audiocall/audiocall.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule,RouterOutlet,NgIf,
    ButtonModule,MenubarModule ,Menubar,
     BadgeModule, AvatarModule, InputTextModule,AudiocallComponent,
      Ripple],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
     items: MenuItem[] | undefined;
  title = 'pfefront';
  isDropdownOpen = false;
  currentUser = ''; // Replace with logged-in user email

     showPopup = false;
  inCall = false ;

      
constructor(private authService: AuthService,private router: Router,private callSvc: CallService){

 

    
}

  ngOnInit() {
 
    
      this.setNavbarElement()
  
  }



  setNavbarElement()
  {
    this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home',
            },
              {
                label: 'Profile',
                icon: 'pi pi-user',
                path:'user'
                
            },
            {
                label: 'Projects',
                icon: 'pi pi-briefcase',
                path:'/project'
               
                // items: [
                //     {
                //         label: 'Core',
                //         icon: 'pi pi-bolt',
                //         shortcut: '⌘+S',
                //     },
                //     {
                //         label: 'Blocks',
                //         icon: 'pi pi-server',
                //         shortcut: '⌘+B',
                //     },
                //     {
                //         separator: true,
                //     },
                //     {
                //         label: 'UI Kit',
                //         icon: 'pi pi-pencil',
                //         shortcut: '⌘+U',
                //     },
                // ],
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
                path:'/chat'
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


  }

  checkislogged()
  {
    console.log( this.authService.isLoggedIn())  

  }

   toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log(this.isDropdownOpen )
  }

  goToRout(path:string)
  {
   
   this.router.navigateByUrl(path);
  }

  setCurrentEmail()
  {}











}
