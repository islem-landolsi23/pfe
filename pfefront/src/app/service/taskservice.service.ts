import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskserviceService {

  constructor(private http :HttpClient) { }

      addTask(task:any):Observable<any>{
       const token = localStorage.getItem('jwt');
         const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
    
          return this.http.post<any>("http://localhost:8080/api/tasks/addTask",task,{headers}) ;



    }
    

         getBySprint(sprintId:any):Observable<any>{
          console.log("ena d5alit")
       const token = localStorage.getItem('jwt');
         const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
    
          return this.http.get<any[]>("http://localhost:8080/api/tasks/getBySprint/"+sprintId,{headers}) ;


          
    }
         getBygetByUser(userEmail:any):Observable<any>{
          console.log("ena d5alit")
       const token = localStorage.getItem('jwt');
         const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
    
          return this.http.get<any[]>("http://localhost:8080/api/tasks/getByUser/"+userEmail,{headers}) ;


          
    }


        delete(id:any):Observable<any>{
          console.log("ena d5alit")
       const token = localStorage.getItem('jwt');
         const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
    
          return this.http.delete<any>("http://localhost:8080/api/tasks/deleteTask/"+id,{headers}) ;


          
    }

     updateStatus(task:any):Observable<any>{
        
       const token = localStorage.getItem('jwt');
         const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
    
          return this.http.put<any>("http://localhost:8080/api/tasks/updateStatus",task,{headers}) ;


          
    }
}
