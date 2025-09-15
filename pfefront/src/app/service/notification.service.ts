import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

private tasknotificationclear = new BehaviorSubject<any |null>(null);
public tasknotificationupdated : Observable<any> =this.tasknotificationclear.asObservable();
   private notificationCall = new BehaviorSubject<any | null>(null); // Initial value is null
      public call$: Observable<any> = this.notificationCall.asObservable();
   openPopUp(message: any): void {

    this.notificationCall.next(message);
      }

      closePopup(): void {
        this.notificationCall.next(null);
      }


      updatedNotification(nottification :any)
      {
        console.log("ena fil update",nottification)
this.tasknotificationclear.next(nottification);
      }
    }

