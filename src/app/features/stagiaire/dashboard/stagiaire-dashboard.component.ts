import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

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
  rapport: any = null;
  ficheSuivi: any = null;
  isUploading = false;
  userId = 0;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail() || '';
    this.userId = this.authService.getUserId();
    this.loadData();
  }

  loadData(): void {
  this.apiService.getMissionsByStagiaire(this.userId).subscribe({
    next: (d) => this.missions = d
  });
  this.apiService.getEvaluationsByStagiaire(this.userId).subscribe({
    next: (d) => this.evaluations = d
  });
  this.loadDocuments();
}

  loadDocuments(): void {
    this.apiService.getRapportStagiaire(this.userId).subscribe({
      next: (d) => this.rapport = d,
      error: () => this.rapport = null
    });
    this.apiService.getFicheSuivi(this.userId).subscribe({
      next: (d) => this.ficheSuivi = d,
      error: () => this.ficheSuivi = null
    });
  }

  onRapportFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.notificationService.add('Seuls les fichiers PDF sont acceptés', 'error');
      return;
    }

    this.isUploading = true;
    this.apiService.deposerRapport(this.userId, file).subscribe({
      next: () => {
        this.isUploading = false;
        this.notificationService.add('Rapport déposé avec succès !', 'success');
        this.loadDocuments();
      },
      error: () => {
        this.isUploading = false;
        this.notificationService.add('Erreur lors du dépôt du rapport', 'error');
      }
    });
  }

  telechargerDocument(id: number, nom: string): void {
    this.apiService.telechargerDocument(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nom;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.notificationService.add('Erreur lors du téléchargement', 'error')
    });
  }

  downloadPdf(): void {
    this.apiService.downloadPdf(this.userId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport-stage-${this.email}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.notificationService.add('Erreur lors du téléchargement', 'error')
    });
  }

  getStatutClass(statut: string): string {
    if (statut === 'EN_COURS' || statut === 'ACTIVE') return 'active';
    if (statut === 'TERMINEE' || statut === 'VALIDE') return 'success';
    if (statut === 'REJETE') return 'rejected';
    return 'pending';
  }

  getStatutRapportLabel(): string {
    if (!this.rapport) return 'Non envoyé';
    switch(this.rapport.statut) {
      case 'EN_ATTENTE': return 'En attente de validation';
      case 'LU': return 'Lu par le RH';
      case 'VALIDE': return 'Validé ✅';
      case 'REJETE': return 'Rejeté ❌';
      default: return 'Inconnu';
    }
  }

  getProgressionStage(): number {
    if (this.missions.length === 0) return 0;
    const terminees = this.missions.filter(m => m.statut === 'TERMINEE').length;
    return Math.round((terminees / this.missions.length) * 100);
  }

  setMenu(menu: string): void { this.activeMenu = menu; }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}