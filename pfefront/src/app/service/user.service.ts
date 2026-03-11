import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../userpage/userpage.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http :HttpClient) { }


 getAllUsers():Observable<any>{
     const token = localStorage.getItem('jwt');
       const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
  
        return this.http.get<any[]>("http://localhost:8080/api/public/getAllUsers",{headers}) ;
  }

getUserByEmail(email :any):Observable<any>
{
    const token = localStorage.getItem('jwt');
       const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
 return  this.http.get<User>('http://localhost:8080/api/public/getUserByEmail/' + email, { headers })
}



saveUser(user :any):Observable<User>
{

    const token = localStorage.getItem('jwt');
       const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
 return  this.http.post<User>('http://localhost:8080/api/public/addUser',user, {headers})
    
}

saveUserImage(user :any):Observable<User>
{

    const token = localStorage.getItem('jwt');
       const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
 return  this.http.post<User>('http://localhost:8080/api/public/saveImageUser',user, {headers})
    
}
}
