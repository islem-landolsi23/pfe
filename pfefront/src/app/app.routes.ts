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
import { JiraTicketCardComponent } from './jira-ticket-card/jira-ticket-card.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';



export const routes: Routes = [

  { path: 'kanban', component: KanbanboardComponent },
  { path: 'login', component: LoginformComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'user', component: UserpageComponent, canActivate: [authGuard], },
  { path: 'project', component: ProjectComponent, canActivate: [authGuard], },
  {
    path: 'ticket',
    loadChildren: () => import('./ticket/ticket.module').then(m => m.TicketModule)
  },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },

  { path: 'kanban2', component: Kanban2Component, canActivate: [authGuard] },
  { path: 'oauth2-redirect', component: Oauth2RedirectComponent, canActivate: [authGuard] },
  { path: 'project-details/:id', component: ProjectdetailsComponent, canActivate: [authGuard] },
  { path: 'sprint/:projectId/:sprintId', component: SprintComponent, canActivate: [authGuard] },
  { path: 'task/:projectId/:sprintId/:task', component: TaskComponent, canActivate: [authGuard], },
  { path: 'videocall', component: VideocallComponent, canActivate: [authGuard] },
  { path: 'multiple', component: MultipleCallComponent, canActivate: [authGuard] },
  { path: 'meeting/:roomId', component: MeetingroomComponent, canActivate: [authGuard] },
  { path: 'call', component: AudiocallComponent, canActivate: [authGuard] },
  { path: 'ticketDetails', component: TicketDetailsComponent, canActivate: [authGuard] },
  { path: 'test', component: JiraTicketCardComponent, canActivate: [authGuard] }


];