import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-rh-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './rh-dashboard.component.html',
  styleUrl: './rh-dashboard.component.css'
})
export class RhDashboardComponent implements OnInit {

  email = '';
  activeMenu = 'dashboard';
  stagiaires: any[] = [];
  missions: any[] = [];
  evaluations: any[] = [];
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  missionForm: FormGroup;
  evaluationForm: FormGroup;
  showMissionForm = false;
  showEvalForm = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.missionForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      stagiaire: this.fb.group({ id: ['', Validators.required] })
    });

    this.evaluationForm = this.fb.group({
      note: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      commentaire: ['', Validators.required],
      dateEvaluation: ['', Validators.required],
      stagiaire: this.fb.group({ id: ['', Validators.required] }),
      responsable: this.fb.group({ id: [3] })
    });
  }

  ngOnInit(): void {
    this.email = this.authService.getEmail() || '';
    this.loadAll();
  }

  loadAll(): void {
    this.apiService.getAllStagiaires().subscribe({ next: (d) => this.stagiaires = d });
    this.apiService.getAllMissions().subscribe({ next: (d) => this.missions = d });
    this.apiService.getAllEvaluations().subscribe({ next: (d) => this.evaluations = d });
  }

  submitMission(): void {
    if (this.missionForm.valid) {
      this.isLoading = true;
      this.apiService.createMission(this.missionForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = '✅ Mission créée avec succès !';
          this.missionForm.reset();
          this.showMissionForm = false;
          this.apiService.getAllMissions().subscribe({ next: (d) => this.missions = d });
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = '❌ Erreur lors de la création.';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  submitEvaluation(): void {
    if (this.evaluationForm.valid) {
      this.isLoading = true;
      this.apiService.createEvaluation(this.evaluationForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = '✅ Évaluation créée avec succès !';
          this.evaluationForm.reset();
          this.showEvalForm = false;
          this.apiService.getAllEvaluations().subscribe({ next: (d) => this.evaluations = d });
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = '❌ Erreur lors de la création.';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  deleteMission(id: number): void {
    if (confirm('Supprimer cette mission ?')) {
      this.apiService.deleteMission(id).subscribe({
        next: () => this.apiService.getAllMissions().subscribe({ next: (d) => this.missions = d })
      });
    }
  }

  deleteEvaluation(id: number): void {
    if (confirm('Supprimer cette évaluation ?')) {
      this.apiService.deleteEvaluation(id).subscribe({
        next: () => this.apiService.getAllEvaluations().subscribe({ next: (d) => this.evaluations = d })
      });
    }
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