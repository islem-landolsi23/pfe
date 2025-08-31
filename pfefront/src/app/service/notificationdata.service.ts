import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationDTO } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationdataService {

  constructor(private http :HttpClient) { }



    getNotification(email:any):Observable<any>{
            console.log("ena d5alit")
         const token = localStorage.getItem('jwt');
           const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          });
      
            return this.http.get<any[]>("http://localhost:8080/api/notification/getNotification/"+email,{headers}) ;
  
  
            
      }


         markListAsread(notification:NotificationDTO):Observable<any>{
            console.log("ena d5alit")
         const token = localStorage.getItem('jwt');
           const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          });
      
            return this.http.post<any[]>("http://localhost:8080/api/notification/markAsRead",notification,{headers}) ;
  
  
            
      }

           markMessageAsread(notification:NotificationDTO):Observable<void>{
            console.log("ena d5alit")
         const token = localStorage.getItem('jwt');
           const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          });
      
            return this.http.post<void>("http://localhost:8080/api/notification/markMessageAsRead",notification,{headers}) ;
  
  
            
      }
}
