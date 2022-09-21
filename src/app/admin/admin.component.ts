import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { CrudComponent } from '../crud/crud.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  displayedColumns = [
    'empId',
    'name',
    'competency',
    'enrollmentDate',
    'dueDate',
    'learningPlan',
    'lmsStatus',
  ];

  dataSource!: MatTableDataSource<any>;
  getStatus: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private api: ApiService
  ) {}

  body = {
    empId: 'All',
    competency: 'All',
    enrollmentDate: 'All',
    dueDate: 'All',
    learningPlan: 'All',
    modules: 'All',
    lmsStatus: [1227, 1206, 1207, 1208, 1209],
    empName: 'All',
  };

  ngOnInit() {
    this.getDetails();
    this.getRole();
  }

  //Function for filter the data
  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // var len = this.dataSource.data.length;
    // if (len >= 5) {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    // }
  }

  //Function for select the dropdown data
  applySelectFilter(event: any) {
    var value = event.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  //Method for fetching data
  getDetails() {
    this.api.fetchDetails(this.body).subscribe((res) => {
      // console.log(res);
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  //Method for fetching data from json enrollment status
  getRole() {
    this.api.getJson().subscribe((res: any) => {
      this.getStatus = res.select_status;
    });
  }

  //Function to open dialog box
  openCrud() {
    this.dialog.open(CrudComponent, {});
  }

  //Method for logout
  logout() {
    this.router.navigate(['/login']);
  }
}
