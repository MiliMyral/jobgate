import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-stagiaire-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './stagiaire-dashboard.component.html',
  styleUrl: './stagiaire-dashboard.component.css'
})
export class StagiaireDashboardComponent implements OnInit {

  email = '';
  activeMenu = 'dashboard';
  missions: any[] = [];
  evaluations: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail() || '';
  }

  setMenu(menu: string): void { this.activeMenu = menu; }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}