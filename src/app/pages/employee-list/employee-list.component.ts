import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'department', 'position'];

  selectedDepartment: string = '';
  selectedPosition: string = '';
  uniqueDepartments: string[] = [];
  uniquePositions: string[] = [];

  loading = true;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (result) => {
        console.log('✅ Employee query result:', result);
        this.employees = result;
        this.uniqueDepartments = [...new Set(result.map(e => e.department))];
        this.uniquePositions = [...new Set(result.map(e => e.position))];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Employee query error:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(emp => {
      const matchesDept = this.selectedDepartment ? emp.department === this.selectedDepartment : true;
      const matchesPos = this.selectedPosition ? emp.position === this.selectedPosition : true;
      return matchesDept && matchesPos;
    });
  }
}
