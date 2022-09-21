import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css'],
})
export class CrudComponent implements OnInit {
  employeeForm!: FormGroup;
  moduleList: any;
  learningData: any;
  lmsstatusList: any;
  actionBtn: String = 'save';
  lmsId: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<CrudComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {
    this.dataFetching();
  }

  ngOnInit(): void {
    this.initAddform();

    /* Bind the data to form controls */
    console.log(this.editData);
    if (this.editData) {
      this.actionBtn = 'update';
      this.employeeForm.controls['empId'].setValue(this.editData.empId);
      this.employeeForm.controls['lmsStatus'].setValue(this.editData.lmsStatus);
      this.employeeForm.controls['enrollmentDate'].setValue(
        this.editData.enrollmentDate
      );
      this.employeeForm.controls['dueDate'].setValue(this.editData.dueDate);
      // this.employeeForm.controls['updatedBy'].setValue(this.editData.updatedBy);
      this.employeeForm.controls['updatedDate'].setValue(
        this.editData.updatedDate
      );
    }
  }

  /* To intialize the create form */
  initAddform() {
    this.employeeForm = this.formBuilder.group({
      empId: ['', Validators.required],
      name: ['', Validators.required],
      learningPlan: ['', Validators.required],
      module: ['', Validators.required],
      enrollmentDate: ['', Validators.required],
      percetageCompletion: [''],
      dueDate: ['', Validators.required],
      requestedDate: ['', Validators.required],
      lmsStatus: ['', Validators.required],
      updatedDate: ['', Validators.required],
      comment: [''],
    });
  }

  /* To create the form */
  addEmployee() {
    let obj = {
      empId: this.employeeForm.value.empId,
      name: this.employeeForm.value.name,
      learningPlan: this.employeeForm.value.learningPlan,
      module: this.employeeForm.value.module,
      enrollmentDate: moment(this.employeeForm.value.enrollmentDate).format(
        'M-D-Y'
      ),
      percetageCompletion: this.employeeForm.value.percetageCompletion,
      dueDate: moment(this.employeeForm.value.dueDate).format('M-D-Y'),
      requestedBy: 37959,
      requestedDate: moment(this.employeeForm.value.requestedDate).format(
        'M-D-Y'
      ),
      lmsStatus: this.employeeForm.value.lmsStatus,
      updatedBy: 37959,
      updatedDate: moment(this.employeeForm.value.updatedDate).format('M-D-Y'),
      comment: this.employeeForm.value.comment,
    };

    /* To create form */
    if (!this.editData) {
      if (this.employeeForm.valid) {
        this.api.saveEmployee(obj).subscribe({
          next: (res) => {
            alert('Employee added successfully');
            this.employeeForm.reset();
            this.dialogRef.close('save');
          },

          error: () => {
            alert('Error while adding the employee');
          },
        });
      }
    } else {
      this.updateEmployee();
    }
  }

  /* update function */
  updateEmployee() {
    /*to get id for lmsstatus*/
    this.lmsstatusList.map((item: any) => {
      if (item.name === this.editData.lmsStatus) {
        this.lmsId.push(item.id);
      }
    });
    /* body structure for update api */
    let struc = [
      {
        empId: this.employeeForm.value.empId,
        lmsstatus: this.lmsId[0],
        enrollmentDate: moment(this.employeeForm.value.enrollmentDate).format(
          'M-D-Y'
        ),
        dueDate: moment(this.employeeForm.value.dueDate).format('M-D-Y'),
        updatedBy: 37959,
        updatedDate: moment(this.employeeForm.value.updatedDate).format(
          'M-D-Y'
        ),
      },
    ];
    let error = this.api.postUpdate(struc).subscribe({
      next: (res) => {
        alert('Employee Updated successfully');
        this.employeeForm.reset();
        this.dialogRef.close('update');
      },
    });
    console.log(error);
  }

  /* To get the data for dropdown values */
  dataFetching() {
    this.api.getJson().subscribe((res: any) => {
      this.moduleList = res.modules;
      this.learningData = res.learning_plan;
      this.lmsstatusList = res.lms_status;
    });
  }
}
