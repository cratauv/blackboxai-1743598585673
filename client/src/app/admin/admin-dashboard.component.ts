import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RoleService } from '../auth/role.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="admin-container">
      <nav class="admin-nav">
        <h2>Admin Dashboard</h2>
        <ul>
          <li><a routerLink="./users" routerLinkActive="active">User Management</a></li>
          <li><a routerLink="./settings" routerLinkActive="active">System Settings</a></li>
          <li><a routerLink="./reports" routerLinkActive="active">Reports</a></li>
        </ul>
      </nav>
      <div class="admin-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
    }
    .admin-nav {
      width: 250px;
      background: #2c3e50;
      color: white;
      padding: 1rem;
    }
    .admin-content {
      flex: 1;
      padding: 1rem;
    }
    .active {
      font-weight: bold;
      color: #3498db;
    }
  `]
})
export class AdminDashboardComponent {
  constructor(private roleService: RoleService) {}
}