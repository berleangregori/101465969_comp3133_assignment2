import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  loading = true;
  error: any;

  selectedDepartment: string = '';
  selectedPosition: string = '';

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
    });
  }

  get filteredEmployees() {
    return this.employees.filter(emp => {
      const matchDept = this.selectedDepartment
        ? emp.department === this.selectedDepartment
        : true;
      const matchPos = this.selectedPosition
        ? emp.position === this.selectedPosition
        : true;
      return matchDept && matchPos;
    });
  }

  get uniqueDepartments() {
    const all = this.employees.map(e => e.department);
    return Array.from(new Set(all));
  }

  get uniquePositions() {
    const all = this.employees.map(e => e.position);
    return Array.from(new Set(all));
  }

  viewDetails(id: string) {
    this.router.navigate(['/employee', id]);
  }

  editEmployee(id: string) {
    this.router.navigate(['/edit-employee', id]);
  }

  deleteEmployee(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => alert('Employee deleted!'),
      error: (err) => alert('Delete failed: ' + err.message),
    });
  }
}
