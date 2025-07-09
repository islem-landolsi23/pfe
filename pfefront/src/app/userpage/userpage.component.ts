import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { log } from 'console';
import { PrimeIcons } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms'
import { FloatLabel } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
@Component({
  selector: 'app-userpage',
  standalone: true,
  imports: [Avatar,AvatarGroup,AvatarModule, DividerModule ,
    OverlayBadgeModule,AccordionModule,
    PanelModule,ButtonModule,CardModule
    ,MenuModule , FormsModule, InputTextModule,FloatLabel],
  templateUrl: './userpage.component.html',
  styleUrl: './userpage.component.scss'
})
export class UserpageComponent implements OnInit ,AfterViewInit {
  isLoggedIn = false;
  avatar_url =''
  user : any
  

constructor(private http: HttpClient,private router: Router) {}
  ngAfterViewInit(): void {
   // throw new Error('Method not implemented.');
    
  }

 


  ngOnInit() {
  this.http.get('http://localhost:8080/api/public/me', { withCredentials: true })
      .subscribe({
        next: (user: any) => {
              this.checkUser(user.email)
          this.isLoggedIn = true;
          this.avatar_url=user.avatar_url

        //  console.log("el user",user)
          this.user =user
        },
        error: () => {
          this.isLoggedIn = false;
        }
      });
  }

saveUser()
{
  let userToadd : User= new User(this.user.name,this.user.github_id,this.user.email,this.user.avatar_url);
 

  this.http.post('http://localhost:8080/api/public/addUser',userToadd, { withCredentials: true })
      .subscribe({
        next: (user: any) => {
      
          this.isLoggedIn = true;
          this.avatar_url=user.avatar_url

         // console.log("el user",user)
         // this.user =user
        },
        error: () => {
          this.isLoggedIn = false;
        }
      });
  }




  checkUser(email : string)
  {
    console.log("hani d5alite ")
    console.log("el email",email)
    //  `http://localhost:8080/api/public/checkUser/${email}`
     this.http.get('http://localhost:8080/api/public/checkUser/'+email, { withCredentials: true })
      .subscribe({
        next: (user: any) => {
          console.log(user)
          if(user != null)
          {

            console.log("hani mawjoude ");
             this.router.navigateByUrl('/kanban');
            
          }else
          {console.log("zidni !!!!!!!")}

    
        },
        error: () => {
          this.isLoggedIn = false;
        }
      });
  }


 
}



export class User {
    constructor(public name: string, public github_id: string ,public email:string,
      public avatarUrl :string
    ) {}
}

