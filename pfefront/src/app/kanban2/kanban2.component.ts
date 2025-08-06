import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem ,DragDropModule} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-kanban2',
  standalone: true,
  imports: [DragDropModule,CommonModule],
  templateUrl: './kanban2.component.html',
  styleUrl: './kanban2.component.scss'
})
export class Kanban2Component {
  board = {
    columns: [
      {
        id: 'todo',
        name: 'To Do',
        tasks: [
          { title: 'Create login page', description: 'Implement using Angular + PrimeNG' },
          { title: 'Set up database', description: 'MongoDB on cloud' }
        ]
      },
      {
        id: 'inprogress',
        name: 'In Progress',
        tasks: [
          { title: 'API integration', description: 'Connect with backend' }
        ]
      },
      {
        id: 'done',
        name: 'Done',
        tasks: [
          { title: 'Project setup', description: 'Initial Angular scaffolding' }
        ]
      }
    ]
  };

  get connectedDropListsIds(): string[] {
    return this.board.columns.map(c => c.id);
  }

  onTaskDrop(event: CdkDragDrop<any[]>, column: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(column.tasks, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        column.tasks,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
