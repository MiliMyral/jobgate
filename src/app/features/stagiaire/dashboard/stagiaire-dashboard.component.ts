import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

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
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail() || '';
    this.loadData();
  }

  loadData(): void {
    this.apiService.getAllMissions().subscribe({ next: (d) => this.missions = d });
    this.apiService.getAllEvaluations().subscribe({ next: (d) => this.evaluations = d });
  }

  setMenu(menu: string): void { this.activeMenu = menu; }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatutClass(statut: string): string {
    if (statut === 'EN_COURS') return 'active';
    if (statut === 'TERMINEE') return 'success';
    return 'pending';
  }
}