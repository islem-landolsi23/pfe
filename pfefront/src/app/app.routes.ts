import { Routes } from '@angular/router';
import { KanbanboardComponent } from './kanbanboard/kanbanboard.component';
import { LoginformComponent } from './loginform/loginform.component';

export const routes: Routes = [

    {path : 'kanban',component :KanbanboardComponent },
     {path : 'login',component :LoginformComponent }
];
