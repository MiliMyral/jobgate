import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  
  selector: 'app-rh-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, FormsModule],
  templateUrl: './rh-dashboard.component.html',
  styleUrl: './rh-dashboard.component.css'
})
export class RhDashboardComponent implements OnInit {

  email = '';
  activeMenu = 'dashboard';
  stagiaires: any[] = [];
  missions: any[] = [];
  evaluations: any[] = [];
  rapports: any[] = [];
  documentsParStagiaire: { [key: number]: { rapport: any, fiche: any } } = {};
  selectedStagiaire: any = null;
  isLoading = false;
  searchQuery = '';
  showValidationModal = false;
  selectedRapport: any = null;
  commentaireRH = '';

  missionForm: FormGroup;
  evaluationForm: FormGroup;
  showMissionForm = false;
  showEvalForm = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.missionForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
       dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      stagiaireId: ['', Validators.required]
      });

  this.evaluationForm = this.fb.group({
      note: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      commentaire: ['', Validators.required],
      dateEvaluation: ['', Validators.required],
      stagiaireId: ['', Validators.required]
      });
  }
onStagiaireSelectMission(event: any): void {
  this.missionForm.patchValue({ stagiaireId: event.target.value });
}

onStagiaireSelectEval(event: any): void {
  this.evaluationForm.patchValue({ stagiaireId: event.target.value });
}

  ngOnInit(): void {
    this.email = this.authService.getEmail() || '';
    this.loadAll();
  }

  loadAll(): void {
  this.apiService.getAllStagiairesUsers().subscribe({
    next: (d) => {
      this.stagiaires = d;
      this.loadDocumentsForAllStagiaires();
    }
  });
  this.apiService.getAllMissions().subscribe({ next: (d) => this.missions = d });
  this.apiService.getAllEvaluations().subscribe({ next: (d) => this.evaluations = d });
  this.apiService.getAllRapports().subscribe({ next: (d) => this.rapports = d });
}

  loadDocumentsForAllStagiaires(): void {
    this.stagiaires.forEach(s => {
      this.documentsParStagiaire[s.id] = { rapport: null, fiche: null };

      this.apiService.getRapportStagiaire(s.id).subscribe({
        next: (r) => this.documentsParStagiaire[s.id].rapport = r,
        error: () => {}
      });

      this.apiService.getFicheSuivi(s.id).subscribe({
        next: (f) => this.documentsParStagiaire[s.id].fiche = f,
        error: () => {}
      });
    });
  }

  get filteredStagiaires(): any[] {
    if (!this.searchQuery) return this.stagiaires;
    const q = this.searchQuery.toLowerCase();
    return this.stagiaires.filter(s =>
      s.nom?.toLowerCase().includes(q) ||
      s.prenom?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  }

  onFicheSuiviSelected(event: any, stagiaireId: number): void {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.notificationService.add('Seuls les fichiers PDF sont acceptés', 'error');
      return;
    }

    this.apiService.deposerFicheSuivi(stagiaireId, file).subscribe({
      next: () => {
        this.notificationService.add('Fiche de suivi déposée avec succès !', 'success');
        this.loadDocumentsForAllStagiaires();
      },
      error: () => this.notificationService.add('Erreur lors du dépôt', 'error')
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
      error: () => this.notificationService.add('Erreur téléchargement', 'error')
    });
  }

  ouvrirValidation(rapport: any): void {
    this.selectedRapport = rapport;
    this.commentaireRH = '';
    this.showValidationModal = true;
  }

  validerRapport(statut: string): void {
    if (!this.selectedRapport) return;
    this.apiService.changerStatutDocument(this.selectedRapport.id, statut, this.commentaireRH).subscribe({
      next: () => {
        this.notificationService.add(
          statut === 'VALIDE' ? 'Rapport validé !' : 'Rapport rejeté.',
          statut === 'VALIDE' ? 'success' : 'warning'
        );
        this.showValidationModal = false;
        this.loadAll();
      }
    });
  }

  submitMission(): void {
  if (this.missionForm.valid) {
    this.isLoading = true;
    const data = {
      titre: this.missionForm.value.titre,
      description: this.missionForm.value.description,
      dateDebut: this.missionForm.value.dateDebut,
      dateFin: this.missionForm.value.dateFin,
      stagiaire: { id: parseInt(this.missionForm.value.stagiaireId) },
      responsable: { id: 3 }
    };
    this.apiService.createMission(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.add('Mission créée !', 'success');
        this.missionForm.reset();
        this.showMissionForm = false;
        this.apiService.getAllMissions().subscribe({ next: (d) => this.missions = d });
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.add('Erreur lors de la création', 'error');
      }
    });
  }
}

  submitEvaluation(): void {
  if (this.evaluationForm.valid) {
    this.isLoading = true;
    const data = {
      note: parseInt(this.evaluationForm.value.note),
      commentaire: this.evaluationForm.value.commentaire,
      dateEvaluation: this.evaluationForm.value.dateEvaluation,
      stagiaire: { id: parseInt(this.evaluationForm.value.stagiaireId) },
      responsable: { id: 3 }
    };
    this.apiService.createEvaluation(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.add('Évaluation créée !', 'success');
        this.evaluationForm.reset();
        this.showEvalForm = false;
        this.apiService.getAllEvaluations().subscribe({ next: (d) => this.evaluations = d });
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.add('Erreur', 'error');
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

  getRapportStatutClass(stagiaireId: number): string {
    const doc = this.documentsParStagiaire[stagiaireId];
    if (!doc?.rapport) return 'pending';
    if (doc.rapport.statut === 'VALIDE') return 'success';
    if (doc.rapport.statut === 'REJETE') return 'rejected';
    return 'active';
  }

  getRapportStatutLabel(stagiaireId: number): string {
    const doc = this.documentsParStagiaire[stagiaireId];
    if (!doc?.rapport) return 'Non déposé';
    switch(doc.rapport.statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'LU': return 'Lu';
      case 'VALIDE': return 'Validé';
      case 'REJETE': return 'Rejeté';
      default: return '—';
    }
  }

  getStatutClass(statut: string): string {
    if (statut === 'EN_COURS') return 'active';
    if (statut === 'TERMINEE') return 'success';
    return 'pending';
  }

  setMenu(menu: string): void { this.activeMenu = menu; }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}