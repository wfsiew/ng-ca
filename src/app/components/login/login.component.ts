import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  mform: FormGroup;
  nextUrl: any;
  viewpwd = false;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.mform = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    var currentPath = this.route.snapshot.routeConfig.path == 'login';
    this.subscription = this.route.queryParams.subscribe(params => {
      if (params['next']) {
        if (this.authService.hasValidToken() && currentPath) {
          this.router.navigate(['/cit']);
        }

        else if (this.authService.hasValidToken() && !currentPath) {
          this.router.navigate([this.nextUrl]);
        }

        else {
          this.router.navigate(['/login']);
        }
      }
    });

    if (this.authService.hasValidToken()) {
      this.router.navigate(['/ca']);
    }
    
    else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    let fm = this.mform.value;
    this.authService.authenticate(fm.username, fm.password).subscribe(
      token => this.onSuccess(token),
      error => this.onError(error)
    );
  }

  invalid(s: string) {
    const m = this.mform.controls[s];
    return m.invalid && (m.dirty || m.touched);
  }

  onSuccess(res) {
    if (this.nextUrl) {
      this.router.navigateByUrl(this.nextUrl)
        .catch(() => this.router.navigate(['/ca']));
    }

    else {
      this.router.navigate(['/cit']);
    }
  }

  onError(error) {
    if (error == 'invalid_grant') {
      alert('Invalid Username or Password');
    }
  }
}
