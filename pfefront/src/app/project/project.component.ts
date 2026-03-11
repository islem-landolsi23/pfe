import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { Avatar } from 'primeng/avatar';
import { DatePickerModule } from 'primeng/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';

import { Dialog, DialogModule } from 'primeng/dialog';
import { log } from 'console';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProjectService } from '../service/project.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [TableModule, TagModule, ButtonModule, InputTextModule, DatePickerModule, FluidModule, TextareaModule,
    IconFieldModule, InputTextModule, Dialog, Toast,
    InputIconModule, MultiSelectModule, SelectModule, FormsModule, DrawerModule, Avatar, ReactiveFormsModule,
    CommonModule],
  providers: [MessageService],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  projectForm!: FormGroup

  searchValue: any
  visible: boolean = false;
  todelete: any;

  visibledelete: boolean = false;

  showdeletDialog(id: any) {
    console.log("project id", id)
    this.todelete = id;
    this.visibledelete = true;
  }
  deleteproject(id: any) {
    this.projectservice.deleteProject(id).subscribe(res => {
      console.log("delete sucessfully ", res)
      this.getdataList();
      this.visibledelete = false;
    })
  }
  projects: any[] = [];


  constructor(private projectservice: ProjectService, private fb: FormBuilder, private router: Router
    , private messageService: MessageService
  ) { }

  ngOnInit() {



    this.getdataList();



    this.projectForm = this.fb.group({
      name: [''],
      description: [''],
      startDate: [null],
      endDate: [null]
    });

  }


  getdataList() {
    this.projectservice.getListProject().subscribe(res => {

      this.projects = res

    })

  }
  onGlobalFilter(event: Event, table: Table) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
  clear(table: Table) {
    table.clear();
  }

  // getSeverity(status: string) {
  //     switch (status) {
  //         case 'unqualified':
  //             return 'danger';

  //         case 'qualified':
  //             return 'success';

  //         case 'new':
  //             return 'info';

  //         case 'negotiation':
  //             return 'warn';


  //     }
  // }


  saveProject() {
    if (this.hasEmptyFields(this.projectForm)) {
      console.log('Form has empty fields');
      this.showError("Form has empty fields")
      return;
    }
    console.log("ena bech nsavi project", this.projectForm.value)
    this.projectservice.addProject(this.projectForm.value).subscribe(
      res => {

        this.getdataList();
        this.visible = false
        this.showSucess()
      })
  }

  goTodetails(p: any) {

    this.router.navigate(['/project-details', p.id]);


  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
  showSucess() {
    this.messageService.add({ severity: 'success', summary: 'success', detail: 'saved successfully ' });
  }

  hasEmptyFields(formGroup: FormGroup): boolean {
    return Object.keys(formGroup.controls).some(key => {
      const control = formGroup.get(key);
      return control?.value === null || control?.value === '';
    });

  }


}
