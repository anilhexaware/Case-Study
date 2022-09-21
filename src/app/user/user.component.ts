import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { CrudComponent } from '../crud/crud.component';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  displayedColumns = [
    'empId',
    'name',
    'competency',
    'learningPlan',
    'enrollmentDate',
    'dueDate',
    'lmsStatus',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  bulkEdit!: FormGroup;
  dataSource!: MatTableDataSource<any>;
  getStatus: any;
  dataSourceList: any;
  bulkEditFlag = false;
  bulkSaveFlag: boolean = false;
  editValues: any = [];
  saveValues: any = [];
  lmstList: any = [];
  idList: any = [];
  arraylist: any = [];
  arrayobjList: any = [];
  edittedValues: any = [];
  mappingValue: any = [];
  lmsIds: any = [];
  arrayObject: any = {};

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder
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

  ngOnInit(): void {
    this.getDetails();
    this.getRole();

    this.bulkEdit = this.formBuilder.group({
      rows: this.formBuilder.array([]),
    });
  }

  //Filter option for ID
  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //LMS Dropdown Select
  applySelectFilter(event: any) {
    var value = event.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  //To fetch the details from api
  getDetails() {
    this.api.fetchDetails(this.body).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSourceList = res.data;
      this.editFormArray();
    });
  }

  //To get the data from json
  getRole() {
    this.api.getJson().subscribe((res: any) => {
      this.getStatus = res.select_status;
    });
  }

  /* Bind the values to table for bulkedit*/
  editFormArray() {
    this.bulkEdit = this.formBuilder.group({
      rows: this.formBuilder.array(
        this.dataSourceList.map((item: any) =>
          this.formBuilder.group({
            empName: new FormControl(item.empName),
            empId: new FormControl(item.empId),
            competency: new FormControl(item.competency),
            enrollmentDate: new FormControl(item.enrollmentDate),
            dueDate: new FormControl(item.dueDate),
            learningPlan: new FormControl(item.learningPlan),
            lmsStatus: new FormControl(item.lmsStatus),
            updatedBy: new FormControl(item.updatedBy),
            updatedDate: new FormControl(item.updatedDate),
          })
        )
      ),
    });

    this.dataSource = new MatTableDataSource(
      (this.bulkEdit.get('rows') as FormArray).value
    );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* bulk edit button */
  edit(row: any) {
    this.bulkEditFlag = true;
    this.bulkSaveFlag = false;
    this.editValues = [];
    if (row) {
      this.editValues = [];
      row._data._value.forEach((data: any) => {
        this.editValues.push(data);
      });
    }
  }

  /* save button */
  save(row: any) {
    this.bulkEditFlag = false;
    this.bulkSaveFlag = true;
    let updatedArray = this.editValues;
    if (row) {
      this.saveValues = [];
      this.lmstList = [];
      this.idList = [];
      this.arraylist = [];
      this.arrayobjList = [];
      this.edittedValues = [];
      this.mappingValue = [];
      console.log(row, 'testingedit');
      this.saveValues.push(row.controls.rows.value);
      this.checkEvaluate(this.saveValues[0], updatedArray);
      this.lmsIds = [];
      this.arraylist.push(this.checkEvaluate(this.saveValues[0], updatedArray));
      this.arraylist.forEach((element: any) => {
        element.forEach((element: any) => {
          this.lmstList.push(element.lmsStatus);
          this.getStatus.forEach((item: any) => {
            if (item.name === element.lmsStatus) {
              this.arraylist.forEach((val: any, index: any) => {
                this.idList.push(item.id);
              });
            }
          });
        });
      });
      for (let allSelectedIds of this.idList) {
        this.arrayObject = {
          lmsStatus: allSelectedIds,
        };
        this.arrayobjList.push(this.arrayObject);
        console.log(this.arrayobjList, 'arraylist');
      }
      for (let val of this.arraylist) {
        for (let selectedVal of val) {
          let arr = {
            dueDate: moment(selectedVal.dueDate).format('YYYY-MM-DD'),
            empId: selectedVal.empId,
            enrollmentDate: moment(selectedVal.enrollmentDate).format(
              'YYYY-MM-DD'
            ),
            updatedBy: 36747,
            updatedDate: '2022-06-17',
          };
          this.mappingValue.push(arr);
          console.log(this.mappingValue, 'arr');
        }
        this.edittedValues = this.mappingValue.map((item: any, i: any) =>
          Object.assign({}, item, this.arrayobjList[i])
        );
        console.log(this.edittedValues, 'result of edit');
      }
    }
  }
  /* get values with not same values between before edit and after save */
  checkEvaluate(array1: any[], array2: any[]) {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return (
          object1.enrollmentDate === object2.enrollmentDate &&
          object1.lmsStatus === object2.lmsStatus &&
          object1.dueDate === object2.dueDate
        );
      });
    });
  }

  //Single row edit Function
  editEmployee(row: any) {
    this.dialog
      .open(CrudComponent, {
        width: '50%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getDetails();
        }
      });
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
