import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-rh-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './rh-dashboard.component.html',
  styleUrl: './rh-dashboard.component.css'
})
export class RhDashboardComponent implements OnInit {

  email = '';
  activeMenu = 'dashboard';
  stagiaires: any[] = [];
  missions: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail() || '';
    this.loadStagiaires();
    this.loadMissions();
  }

  loadStagiaires(): void {
    this.http.get<any[]>('http://localhost:8085/api/stagiaires').subscribe({
      next: (data) => this.stagiaires = data,
      error: (err) => console.error(err)
    });
  }

  loadMissions(): void {
    this.http.get<any[]>('http://localhost:8085/api/missions').subscribe({
      next: (data) => this.missions = data,
      error: (err) => console.error(err)
    });
  }

  setMenu(menu: string): void { this.activeMenu = menu; }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}