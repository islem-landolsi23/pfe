import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {



  constructor(private http: HttpClient) {


  }




  addProject(project: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>("http://localhost:8080/api/projects/add", project, { headers });

  }

  UpdateProject(project: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log("token", token)
    return this.http.post<any>("http://localhost:8080/api/projects/gengercool", project, { headers });

  }

  getListProject(): Observable<any[]> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>("http://localhost:8080/api/projects/getAll", { headers });

  }

  getProjectById(prjectId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>("http://localhost:8080/api/projects/getById/" + prjectId, { headers });
  }


  deleteProject(prjectId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete<any>("http://localhost:8080/api/projects/Delete/" + prjectId, { headers });
  }
  saveSprints(project: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>("http://localhost:8080/api/projects/addSprints", project, { headers });
  }
}
