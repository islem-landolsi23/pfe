import { Routes } from '@angular/router';
import { KanbanboardComponent } from './kanbanboard/kanbanboard.component';
import { LoginformComponent } from './loginform/loginform.component';
import { UserpageComponent } from './userpage/userpage.component';

export const routes: Routes = [

    {path : 'kanban',component :KanbanboardComponent },
     {path : 'login',component :LoginformComponent },
      {path : 'user',component :UserpageComponent }
];
