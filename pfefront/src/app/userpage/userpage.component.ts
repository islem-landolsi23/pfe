import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-userpage',
  standalone: true,
  imports: [],
  templateUrl: './userpage.component.html',
  styleUrl: './userpage.component.scss'
})
export class UserpageComponent implements OnInit{
  isLoggedIn = false;
  avatar_url =''
  user : any

constructor(private http: HttpClient) {}

 


  ngOnInit() {
  this.http.get('http://localhost:8080/api/public/me', { withCredentials: true })
      .subscribe({
        next: (user: any) => {
          this.isLoggedIn = true;
          this.avatar_url=user.avatar_url

          console.log("el user",user)
          this.user =user
        },
        error: () => {
          this.isLoggedIn = false;
        }
      });
  }




}
