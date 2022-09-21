import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  getRoles: any;
  error: string | undefined;
  loggedin: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.getRole();
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rolesData: ['', Validators.required],
    });
  }

  //To get the roles data from db json file
  getRole() {
    this.api.getJson().subscribe((res: any) => {
      this.getRoles = res.login_crede;
    });
  }

  //To particular page
  applySelectFilter(event: any) {
    if (event == null) {
      event.value = '';
    }
  }

  //Validation on mail, password & roles
  onSubmit() {
    this.loggedin = true;
    if (this.form.invalid) {
      return;
    }
    let obj = {
      email: this.form.value.email,
      password: this.form.value.password,
      rolesData: this.form.value.rolesData,
    };

    const accountName = this.getRoles.find(
      (objs: any) => objs.email === obj.email
    );

    if (accountName == undefined) {
      this.error = 'Invalid User';
    } else {
      if (accountName && accountName.password == obj.password) {
        if (accountName.role === obj.rolesData) {
          obj.rolesData === 'Varsity SPOC'
            ? this.router.navigate(['/header/user'])
            : obj.rolesData === 'Competency Lead'
            ? this.router.navigate(['/header/admin'])
            : '';
          localStorage.setItem('role', obj.rolesData);
          this.loggedin = false;
        } else {
          this.error = 'Role mismatched';
        }
      } else {
        this.error = 'Password is wrong';
      }
    }
  }
}
