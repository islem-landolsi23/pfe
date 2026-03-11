import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  constructor(private http :HttpClient) { }


  getProjectById(sprintId :string):Observable<any>{
     const token = localStorage.getItem('jwt');
       const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
  
        return this.http.get<any>("http://localhost:8080/api/sprint/getById/"+sprintId,{headers}) ;
  }
}
