
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './oauth2-redirect.component.html',
  styleUrl: './oauth2-redirect.component.scss'
})
export class Oauth2RedirectComponent implements OnInit{
    constructor(private route: ActivatedRoute, private router: Router) {}
 ngOnInit(): void {
  console.log("hello")
    const token = this.route.snapshot.queryParamMap.get('token');
     const email = this.route.snapshot.queryParamMap.get('email');
    console.log("the token =",token)
    if (token  && email) {
      localStorage.setItem('jwt', token);
       localStorage.setItem('email', email);

      this.router.navigate(['/user']); // Or your main page
    } else {
      // fallback if no token
      this.router.navigate(['/login']);
    }
  }
}
