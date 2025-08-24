import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }


   private notificationCall = new BehaviorSubject<any | null>(null); // Initial value is null
      public call$: Observable<any> = this.notificationCall.asObservable();




       openPopUp(message: any): void {


        console.log("ena fil el open popup")
        
        //this.outgoingCall.set({ toEmail: this.email, type: 'CALL' });
        console.log(message)
        console.log(typeof message)
  //  console.log(message.get("toEmail"))

        this.notificationCall.next(message);
      }

      closePopup(): void {
        this.notificationCall.next(null);
      }
    }

