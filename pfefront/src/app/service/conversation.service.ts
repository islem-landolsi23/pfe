import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(private http :HttpClient) { }








  createOrGetPrivateChat(userid1 :number,userid2:number):Observable<any>{
     const token = localStorage.getItem('jwt');
       const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
       const params = new HttpParams()
      .set('userAId', userid1)
      .set('userBId', userid2);
    
  
        return this.http.post<any>("http://localhost:8080/api/conversations/private",{},{params}) ;
  }


    getMessagesByConversation(conversationID :any):Observable<any>{
  
  
    
  
        return this.http.get<any>("http://localhost:8080/api/conversations/getMessages/"+conversationID) ;
  }
}
