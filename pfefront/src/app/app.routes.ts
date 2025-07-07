import { Routes } from '@angular/router';
import { KanbanboardComponent } from './kanbanboard/kanbanboard.component';
import { LoginformComponent } from './loginform/loginform.component';
import { UserpageComponent } from './userpage/userpage.component';
import { authGuard } from './auth/authGuard';
import { ProjectComponent } from './project/project.component';

export const routes: Routes = [

    {path : 'kanban',component :KanbanboardComponent },
     {path : 'login',component :LoginformComponent },
      {path : 'user',component :UserpageComponent,  canActivate: [authGuard], },
        {path : 'project',component :ProjectComponent,  canActivate: [authGuard], }
];
