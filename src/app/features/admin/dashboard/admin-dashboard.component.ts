import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  email = '';
  activeMenu = 'dashboard';
  stats = { total: 0, pending: 0, active: 0, rejected: 0 };
  pendingUsers: any[] = [];
  allUsers: any[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showCreateRH = false;
  createRHForm: FormGroup;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createRHForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.email = this.authService.getEmail() || '';
    this.loadStats();
    this.loadPendingUsers();
    this.loadAllUsers();
  }

  loadStats(): void {
    this.apiService.getAdminStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error(err)
    });
  }

  loadPendingUsers(): void {
    this.apiService.getPendingUsers().subscribe({
      next: (data) => this.pendingUsers = data,
      error: (err) => console.error(err)
    });
  }

  loadAllUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (data) => this.allUsers = data,
      error: (err) => console.error(err)
    });
  }

  activateUser(id: number): void {
    this.apiService.activateUser(id).subscribe({
      next: () => {
        this.notificationService.add('Compte activé avec succès !', 'success');
        this.loadStats();
        this.loadPendingUsers();
        this.loadAllUsers();
      }
    });
  }

  rejectUser(id: number): void {
    this.apiService.rejectUser(id).subscribe({
      next: () => {
        this.notificationService.add('Compte refusé.', 'warning');
        this.loadStats();
        this.loadPendingUsers();
        this.loadAllUsers();
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Confirmer la suppression ?')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => {
          this.notificationService.add('Utilisateur supprimé.', 'warning');
          this.loadStats();
          this.loadAllUsers();
        }
      });
    }
  }

  submitCreateRH(): void {
    if (this.createRHForm.valid) {
      this.isLoading = true;
      this.apiService.createRH(this.createRHForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.notificationService.add('Compte RH créé avec succès !', 'success');
          this.createRHForm.reset();
          this.showCreateRH = false;
          this.loadAllUsers();
        },
        error: () => {
          this.isLoading = false;
          this.notificationService.add('Erreur lors de la création du compte RH.', 'error');
        }
      });
    }
  }

  setMenu(menu: string): void { this.activeMenu = menu; }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleBadge(user: any): string {
    const role = user.roles?.[0]?.name || '';
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_RH') return 'RH';
    return 'Stagiaire';
  }

  getStatusClass(status: string): string {
    if (status === 'ACTIVE') return 'active';
    if (status === 'PENDING') return 'pending';
    return 'rejected';
  }
}