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
}
