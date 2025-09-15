import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { error, log } from 'console';
import { PrimeIcons } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FloatLabel } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { PasswordModule } from 'primeng/password';
import { Fluid } from 'primeng/fluid';
import { CommonModule } from "@angular/common";
import { FileService } from '../service/file.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-userpage',
  standalone: true,
  imports: [Avatar, AvatarGroup, AvatarModule, DividerModule, CommonModule, ReactiveFormsModule,
    OverlayBadgeModule, AccordionModule, RippleModule, PasswordModule,
    PanelModule, ButtonModule, CardModule, Fluid
    , MenuModule, FormsModule, InputTextModule, FloatLabel],
  templateUrl: './userpage.component.html',
  styleUrl: './userpage.component.scss'
})
export class UserpageComponent implements OnInit, AfterViewInit {
  isLoggedIn = false;
  avatar_url = ''
  user: any
  password = ""
  isOpen = false;
  userForm: FormGroup;
  constructor(private http: HttpClient, private router: Router, private fileservice: FileService,
    private fb: FormBuilder, private userservice: UserService

  ) {

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: "", disabled: true }],
      password: ['', Validators.required]
    });
  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');

  }

  setFormValues() {



    this.userForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      password: this.user.password
    });
  }




  ngOnInit() {
    const jwtToken = localStorage.getItem('jwt');
    const savedEmail = localStorage.getItem('email');
    const headers = {
      'Authorization': `Bearer ${jwtToken}`
    };

    // 1️⃣ Try with saved email + token first
    this.http.get<User>('http://localhost:8080/api/public/getUserByEmail/' + savedEmail, { headers })
      .subscribe({
        next: (res) => {
          if (this.isGitAvatar(res.avatarUrl) == true) {
            this.avatar_url = res.avatarUrl;
          }
          else {
            this.avatar_url = "http://localhost:8080" + res.avatarUrl

          }
          this.user = res;
          this.isLoggedIn = true;
          this.setFormValues();
        },
        error: (err) => {
          console.error("Erreur lors de l’appel API (getUserByEmail), fallback to /me:", err);

          // 2️⃣ If that fails, fallback to /me
          this.http.get('http://localhost:8080/api/public/me', { withCredentials: true })
            .subscribe({
              next: (user: any) => {
                this.isLoggedIn = true;
                this.avatar_url = user.avatar_url;
                this.user = user;
                this.setFormValues();
              },
              error: (err2) => {
                console.error("Erreur lors de l’appel API (/me):", err2);
              }
            });
        }
      });

  }

  saveUser() {

    let password = "";
    if (this.password.length == 0)
      password = "change me"
    else
      password = this.password
    let userToadd: User = new User(this.userForm.get('name')?.value, this.user.github_id,
      this.user.email,
      this.userForm.get('password')?.value,
      this.avatar_url);

    console.log(userToadd)

    this.userservice.saveUser(userToadd).subscribe({
      next: (res) => {
        console.log("user saved", res)
      }, error: (err) => {
        console.log(err)
      }
    }
    )


  }
  isGitAvatar(url: string): boolean {

    if (!url) return false; // handle empty or null
    // Check if the URL contains a GitHub domain (or other git provider)
    return url.includes('githubusercontent.com') || url.includes('gitlab.com') || url.includes('bitbucket.org');
  }






  checkUserGit(email: string) {


    //  `http://localhost:8080/api/public/checkUser/${email}`
    this.http.get('http://localhost:8080/api/public/checkUser/' + email, { withCredentials: true })
      .subscribe({
        next: (user: any) => {

          if (user != null) {






          } else {
            const jwtToken = localStorage.getItem('jwt');
            const savedEmail = localStorage.getItem('email');
            const headers = {
              'Authorization': `Bearer ${jwtToken}`
            };

            this.http.get<User>('http://localhost:8080/api/public/getUserByEmail/' + savedEmail, { headers })
              .subscribe({
                next: (res) => {
                  this.avatar_url = res.avatarUrl;
                  this.user = res;
                },
                error: (err) => {
                  console.error("Erreur lors de l’appel API :", err);
                }
              });
          }


        },
        error: () => {
          this.isLoggedIn = false;
        }
      });
  }


  openModal() {
    this.isOpen = true
  }
  closeModal() {
    this.isOpen = false
  }



  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.processFile(file);
    }
  }
  previewUrl: string | null = null;
  errorMessage: string | null = null;
  selectedFile: File | null = null;

  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedTypes = ["image/jpeg", "image/png", "image/gif"];

  processFile(file: File): void {
    this.errorMessage = null;

    if (!this.allowedTypes.includes(file.type)) {
      this.errorMessage = "Please upload only JPG, PNG or GIF images";
      return;
    }

    if (file.size > this.maxFileSize) {
      this.errorMessage = "File size should not exceed 5MB";
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  saveImage(): void {
    if (this.selectedFile) {



      this.fileservice.saveFile(this.selectedFile).subscribe(res => {

        let user = {
          email: this.user.email,
          avatarUrl: res.fileUrl

        }
        this.userservice.saveUserImage(user).subscribe(res => {

        })

      })


      this.closeModal();
    }
  }

}

export class User {
  constructor(public name: string, public github_id: string, public email: string, public password: string,
    public avatarUrl: string
  ) { }
}

