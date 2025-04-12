import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AnalyticsDashboardComponent } from './analytics-dashboard.component';
import { BookingStatsComponent } from './booking-stats.component';
import { UserActivityComponent } from './user-activity.component';
import { BookingTrendsComponent } from './booking-trends.component';
import { PopularOptionsComponent } from './popular-options.component';
import { BaseChartDirective } from 'ng2-charts';

const routes: Routes = [
  { 
    path: 'analytics',
    component: AnalyticsDashboardComponent,
    children: [
      { 
        path: 'stats', 
        component: BookingStatsComponent,
        data: { title: 'Booking Statistics' }
      },
      { 
        path: 'users', 
        component: UserActivityComponent,
        data: { title: 'User Activity' }
      },
      { 
        path: 'trends', 
        component: BookingTrendsComponent,
        data: { title: 'Booking Trends' }
      },
      { 
        path: 'popular', 
        component: PopularOptionsComponent,
        data: { title: 'Popular Options' }
      },
      { 
        path: '', 
        redirectTo: 'stats', 
        pathMatch: 'full',
        data: { title: 'Analytics Dashboard' }
      }
    ]
  }
];

@NgModule({
  declarations: [
    AnalyticsDashboardComponent,
    BookingStatsComponent,
    UserActivityComponent,
    BookingTrendsComponent,
    PopularOptionsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    BaseChartDirective
  ]
})
export class AnalyticsModule { }