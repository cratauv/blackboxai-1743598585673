import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationQueueComponent } from './moderation-queue/moderation-queue.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-moderation-dashboard',
  standalone: true,
  imports: [CommonModule, ModerationQueueComponent, RouterModule],
  template: `
    <div class="moderation-dashboard">
      <nav class="moderation-nav">
        <a routerLink="queue" routerLinkActive="active">Review Queue</a>
        <a routerLink="flagged" routerLinkActive="active">Flagged Content</a>
        <a routerLink="stats" routerLinkActive="active">Moderation Stats</a>
      </nav>
      <div class="moderation-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .moderation-dashboard {
      padding: 1rem;
    }
    .moderation-nav {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .moderation-nav a {
      padding: 0.5rem 1rem;
      text-decoration: none;
      color: #333;
      border-radius: 4px;
    }
    .moderation-nav a.active {
      background: #0066cc;
      color: white;
    }
    .moderation-content {
      padding: 1rem;
    }
  `]
})
export class ModerationDashboardComponent {}