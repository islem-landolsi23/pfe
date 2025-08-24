import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Import this
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { PanelModule } from 'primeng/panel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProjectService } from '../service/project.service';
import { Dialog } from 'primeng/dialog';
import {
  FormArray,
  Validators
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { log } from 'console';
import { SprintService } from '../service/sprint.service';
import { JiraTicketCardComponent } from '../jira-ticket-card/jira-ticket-card.component';


@Component({
  selector: 'app-sprint',
  standalone: true,
  imports: [ButtonModule, AccordionModule, TableModule, CommonModule, DatePickerModule,DropdownModule,
    CardModule, FluidModule, IconFieldModule, InputIconModule,Dialog,TagModule,JiraTicketCardComponent,
    TextareaModule, InputTextModule, FormsModule, ReactiveFormsModule, PanelModule],
  templateUrl: './sprint.component.html',
  styleUrl: './sprint.component.scss'
})
export class SprintComponent implements OnInit{
  sprintForm!: FormGroup;
  project :any
  visible: boolean = false;
  projectId :any
  sprintId :any
  listsprints = [];
searchValue :any

constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private projectservice: ProjectService , private sprintService :SprintService) {

   this.sprintForm = this.fb.group({
      name: [''],
      description: [''],
      startDate: [null],
      endDate: [null]
    });
 


    }
  ngOnInit(): void {
   this.route.paramMap.subscribe(params => {
      this.sprintId = params.get('sprintId'); // 'id' matches the variable name in the route path

 this.sprintService.getProjectById(this.sprintId ).subscribe(res=>{
  console.log(" ti adheka :",res)
 this.sprintForm.get('name')?.setValue(res.name)
this.setValues(res)
 })
    });
  }

  setValues(sprint :any){
    this.sprintForm.controls['name'].setValue(sprint.name)
        this.sprintForm.controls['description'].setValue(sprint.description)
            this.sprintForm.controls['startDate'].setValue( this.formatDate(sprint.startDate))
                this.sprintForm.controls['endDate'].setValue(this.formatDate(sprint.endDate))
      
        

  }

  formatDate(dateString: string): string {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}



  onGlobalFilter(event: Event, table: Table) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
  clear(table: Table) {
    table.clear();
  }


  getSeverity(status: string):'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
    case 'Not Started':
      return 'secondary';
    case 'In Progress':
      return 'info';
    case 'Completed':
      return 'success';
    case 'Ended':
      return 'danger'; // example additional status
    default:
      return 'warn'; // ✅ ensures a return value
  }
}
}
