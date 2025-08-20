
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './oauth2-redirect.component.html',
  styleUrl: './oauth2-redirect.component.scss'
})
export class Oauth2RedirectComponent implements OnInit{
    constructor(private route: ActivatedRoute, private router: Router , private authservice :AuthService) {}
 ngOnInit(): void {

    const token = this.route.snapshot.queryParamMap.get('token');
     const email = this.route.snapshot.queryParamMap.get('email');
  
    if (token  && email) {
      localStorage.setItem('jwt', token);
       localStorage.setItem('email', email);
       this.authservice.changeData(email)

      this.router.navigate(['/user']); // Or your main page
    } else {
      // fallback if no token
      this.router.navigate(['/login']);
    }
  }
}
