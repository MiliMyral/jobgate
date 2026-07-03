import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  email = '';
  stats = { total: 0, pending: 0, active: 0, rejected: 0 };
  pendingUsers: any[] = [];
  activeMenu = 'dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail() || '';
    this.loadStats();
    this.loadPendingUsers();
  }

  loadStats(): void {
    this.http.get<any>('http://localhost:8085/api/admin/stats').subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error(err)
    });
  }

  loadPendingUsers(): void {
    this.http.get<any[]>('http://localhost:8085/api/admin/users/pending').subscribe({
      next: (data) => this.pendingUsers = data,
      error: (err) => console.error(err)
    });
  }

  activateUser(id: number): void {
    this.http.put(`http://localhost:8085/api/admin/users/${id}/activate`, {}).subscribe({
      next: () => {
        this.loadStats();
        this.loadPendingUsers();
      }
    });
  }

  rejectUser(id: number): void {
    this.http.put(`http://localhost:8085/api/admin/users/${id}/reject`, {}).subscribe({
      next: () => {
        this.loadStats();
        this.loadPendingUsers();
      }
    });
  }

  setMenu(menu: string): void {
    this.activeMenu = menu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}