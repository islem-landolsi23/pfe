import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddticketComponent } from './addticket/addticket.component';



@NgModule({
  declarations: [],
  imports: [
      RouterModule.forChild([
      {
        path: 'add',
        component: AddticketComponent,
      },
    ]),
    CommonModule,
    
  ]
})
export class TicketModule { }
