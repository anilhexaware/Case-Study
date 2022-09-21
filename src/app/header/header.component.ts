import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrudComponent } from '../crud/crud.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  rolesData: any;
  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.rolesData = localStorage.getItem('role');
    console.log(this.rolesData);
  }

 

  //Method for logout
  logout() {
    this.router.navigate(['/login']);
  }
}
