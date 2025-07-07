import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { log } from 'console';
@Component({
  selector: 'app-userpage',
  standalone: true,
  imports: [],
  templateUrl: './userpage.component.html',
  styleUrl: './userpage.component.scss'
})
export class UserpageComponent implements OnInit ,AfterViewInit {
  isLoggedIn = false;
  avatar_url =''
  user : any
   isPanelOpen1 = false;
    isPanelOpen2 = false;
  panelScrollHeight1 = '0px';
   panelScrollHeight2 = '0px';
  @ViewChild('panelRef1') panelRef1!: ElementRef;
   @ViewChild('panelRef2') panelRef2!: ElementRef;

constructor(private http: HttpClient,private router: Router) {}
  ngAfterViewInit(): void {
   // throw new Error('Method not implemented.');
    this.panelScrollHeight1 = this.panelRef1.nativeElement.scrollHeight + 'px';
       this.panelScrollHeight2 = this.panelRef2.nativeElement.scrollHeight + 'px';
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


  togglePanel(n :any): void {
console.log(n)
    if(n == 1)
    this.isPanelOpen1 = !this.isPanelOpen1;
  if(n == 2)
     this.isPanelOpen2 = !this.isPanelOpen2;
  }
}



export class User {
    constructor(public name: string, public github_id: string ,public email:string,
      public avatarUrl :string
    ) {}
}

