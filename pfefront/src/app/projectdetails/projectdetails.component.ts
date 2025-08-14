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

import { Dialog } from 'primeng/dialog';
import {
  FormArray,
  Validators
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { log } from 'console';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-projectdetails',
  standalone: true,
  imports: [ButtonModule, AccordionModule, TableModule, CommonModule, DatePickerModule,DropdownModule,
    CardModule, FluidModule, IconFieldModule, InputIconModule,Dialog,TagModule,
    TextareaModule, InputTextModule, FormsModule, ReactiveFormsModule, PanelModule],
  templateUrl: './projectdetails.component.html',
  styleUrl: './projectdetails.component.scss'
})
export class ProjectdetailsComponent implements OnInit {
  searchValue: any
  projectId: any
  projectForm!: FormGroup;
  project :any
  visible: boolean = false;
  listsprints = [];


  form: FormGroup;
  statusOptions = [
    { label: 'Not Started', value: 'Not Started' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' }
  ];


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

  //constructor() {}
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private projectservice: ProjectService) {
    this.projectForm = this.fb.group({
      name: [''],
      description: [''],
      startDate: [null],
      endDate: [null]
    });
    this.form = this.fb.group({
      sprints: this.fb.array([])
    })
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id'); // 'id' matches the variable name in the route path

      this.projectservice.getProjectById(this.projectId).subscribe(res => {
    this.listsprints=res.sprints
        this.project=res
        this.setValues(res)
      })
    });


  }



  navigateToSprint(sprint: any) {

    this.router.navigate(['/sprint', this.projectId, sprint.id]);


  }
  onGlobalFilter(event: Event, table: Table) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
  clear(table: Table) {
    table.clear();
  }


  setValues(project :any){
    this.projectForm.controls['name'].setValue(project.name)
        this.projectForm.controls['description'].setValue(project.description)
            this.projectForm.controls['startDate'].setValue( this.formatDate(project.startDate))
                this.projectForm.controls['endDate'].setValue(this.formatDate(project.endDate))
                project.sprints.forEach((sprint: any) => {
          this.sprints.push(this.createSprintFormGroup(sprint));
        });

  }


  formatDate(dateString: string): string {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}


    showDialog() {
        this.visible = true;
    }


  createSprintFormGroup(data?: any): FormGroup {
    return this.fb.group({
      name: [data?.name || '', Validators.required],
      startDate: [data?.startDate ? new Date(data.startDate) : null, Validators.required],
      endDate: [data?.endDate ? new Date(data.endDate) : null, Validators.required],
    status: [this.mapStatusToDropdownValue(data?.status) || null, Validators.required]
    });
  }

  mapStatusToDropdownValue(status: string): any {
  return this.statusOptions.find(opt => opt.value === status);
}

     createSprint(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      status: [null, Validators.required]
    });
  }

  addSprint(): void {
    this.sprints.push(this.createSprint());
  }

  removeSprint(index: number): void {
    this.sprints.removeAt(index);
  }
   get sprints(): FormArray {

    return this.form.get('sprints') as FormArray;
  }


  checkSprint()
  {
    // console.log(this.form.get('sprints')?.value );
    // this.project.sprints=this.form.get('sprints')?.value
    // console.log(this.project)

    const sprintsRaw = this.form.get('sprints')?.value || [];

// Transform: replace { label, value } with just value
const sprintsTransformed = sprintsRaw.map((sprint: any) => ({
  ...sprint,
  status: sprint.status?.value || sprint.status // fallback if already string
}));

this.project.sprints = sprintsTransformed;
    this.projectservice.saveSprints( this.project).subscribe(res=>{
      console.log("new project ",res)
    })


  }
}
