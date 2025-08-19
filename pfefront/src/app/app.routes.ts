import { Routes } from '@angular/router';
import { KanbanboardComponent } from './kanbanboard/kanbanboard.component';
import { LoginformComponent } from './loginform/loginform.component';
import { UserpageComponent } from './userpage/userpage.component';
import { authGuard } from './auth/authGuard';
import { ProjectComponent } from './project/project.component';
import { ChatComponent } from './chat/chat.component';
import { Kanban2Component } from './kanban2/kanban2.component';
import { Oauth2RedirectComponent } from './oauth2-redirect/oauth2-redirect.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { SprintComponent } from './sprint/sprint.component';
import { TaskComponent } from './task/task.component';
import { VideocallComponent } from './videocall/videocall.component';
import { MultipleCallComponent } from './multiple-call/multiple-call.component';
import { MeetingroomComponent } from './meetingroom/meetingroom.component';
import { AudiocallComponent } from './audiocall/audiocall.component';



export const routes: Routes = [

    {path : 'kanban',component :KanbanboardComponent },
     {path : 'login',component :LoginformComponent },
      {path : 'user',component :UserpageComponent,  canActivate: [authGuard], },
        {path : 'project',component :ProjectComponent,  canActivate: [authGuard], },
        {
        path: 'ticket',
        loadChildren: () => import('./ticket/ticket.module').then(m => m.TicketModule)
      },
        {path : 'chat',component :ChatComponent },
     
            {path : 'kanban2',component :Kanban2Component },
            { path: 'oauth2-redirect', component: Oauth2RedirectComponent },
              { path: 'project-details/:id', component: ProjectdetailsComponent },
                { path: 'sprint/:projectId/:sprintId', component: SprintComponent },
                  { path: 'task/:projectId/:sprintId/:task', component: TaskComponent },
                    { path: 'videocall', component: VideocallComponent },
                     { path: 'multiple', component: MultipleCallComponent },
                      { path: 'meeting', component: MeetingroomComponent },
                       { path: 'call', component: AudiocallComponent }

                      


];