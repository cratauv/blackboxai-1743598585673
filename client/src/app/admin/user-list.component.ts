import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementService } from './user-management.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  template: `
    <div class="user-management">
      <h2>User Management</h2>
      
      <div class="filters">
        <input type="text" [(ngModel)]="searchTerm" placeholder="Search users...">
        <select [(ngModel)]="statusFilter">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      
      <div *ngIf="loading" class="loading">Loading users...</div>
      <div *ngIf="error" class="error">{{error}}</div>
      
      <table *ngIf="users.length > 0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of filteredUsers">
            <td>{{user.name}}</td>
            <td>{{user.email}}</td>
            <td>
              <span *ngFor="let role of user.roles" class="role-badge">{{role}}</span>
            </td>
            <td>
              <span [class.active]="user.status === 'active'" 
                    [class.suspended]="user.status === 'suspended'">
                {{user.status}}
              </span>
            </td>
            <td>{{user.createdAt | date}}</td>
            <td class="actions">
              <button (click)="openEditModal(user)">Edit</button>
              <button (click)="toggleStatus(user)" 
                      [class.suspend]="user.status === 'active'"
                      [class.activate]="user.status === 'suspended'">
                {{user.status === 'active' ? 'Suspend' : 'Activate'}}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div *ngIf="users.length === 0 && !loading" class="empty">
        No users found
      </div>
    </div>
  `,
  styles: [`
    .user-management {
      padding: 2rem;
    }
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: #e0e0e0;
      border-radius: 4px;
      margin-right: 0.5rem;
      font-size: 0.8rem;
    }
    .active {
      color: #2e7d32;
    }
    .suspended {
      color: #c62828;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .suspend {
      color: #c62828;
    }
    .activate {
      color: #2e7d32;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  statusFilter = '';

  constructor(private userService: UserManagementService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || user.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  openEditModal(user: any) {
    // Implementation would open edit modal/dialog
    console.log('Edit user:', user);
  }

  toggleStatus(user: any) {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    this.userService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Failed to update user status')
    });
  }
}