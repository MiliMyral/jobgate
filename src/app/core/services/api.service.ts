import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8085/api';

  constructor(private http: HttpClient) {}

  // === ADMIN ===
  getAdminStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/stats`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/users`);
  }

  getPendingUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/users/pending`);
  }

  activateUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/users/${id}/activate`, {});
  }

  rejectUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/users/${id}/reject`, {});
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/users/${id}`);
  }

  createRH(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/rh`, data);
  }

  // === STAGIAIRES ===
  getAllStagiairesUsers(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/stagiaires/users`);
}
getEvaluationsByStagiaire(stagiaireId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/evaluations/stagiaire/${stagiaireId}`);
}
  // Missions d'un stagiaire spécifique
  getMissionsByStagiaire(stagiaireId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/missions/stagiaire/${stagiaireId}`);
  }

  getAllStagiaires(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stagiaires`);
  }

  getStagiaireById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/stagiaires/${id}`);
  }

  createStagiaire(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/stagiaires`, data);
  }

  updateStagiaire(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/stagiaires/${id}`, data);
  }

  deleteStagiaire(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/stagiaires/${id}`);
  }

  // === MISSIONS ===
  getAllMissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/missions`);
  }

  createMission(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/missions`, data);
  }

  updateMission(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/missions/${id}`, data);
  }

  deleteMission(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/missions/${id}`);
  }

  // === EVALUATIONS ===
  getAllEvaluations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/evaluations`);
  }

  createEvaluation(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/evaluations`, data);
  }

  deleteEvaluation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/evaluations/${id}`);
  }

  // === FEEDBACKS ===
  getAllFeedbacks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/feedbacks`);
  }

  createFeedback(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/feedbacks`, data);
  }

  // === PDF GENERE ===
  downloadPdf(stagiaireId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/pdf/stagiaire/${stagiaireId}`, {
      responseType: 'blob'
    });
  }

  // === DOCUMENTS ===
  deposerRapport(stagiaireId: number, fichier: File): Observable<string> {
    const formData = new FormData();
    formData.append('fichier', fichier);
    return this.http.post(
      `${this.baseUrl}/documents/rapport/${stagiaireId}`,
      formData,
      { responseType: 'text' }
    );
  }

  deposerFicheSuivi(stagiaireId: number, fichier: File): Observable<string> {
    const formData = new FormData();
    formData.append('fichier', fichier);
    return this.http.post(
      `${this.baseUrl}/documents/fiche-suivi/${stagiaireId}`,
      formData,
      { responseType: 'text' }
    );
  }

  getRapportStagiaire(stagiaireId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/documents/rapport/${stagiaireId}`);
  }

  getFicheSuivi(stagiaireId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/documents/fiche-suivi/${stagiaireId}`);
  }

  getDocumentsByStagiaire(stagiaireId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/documents/stagiaire/${stagiaireId}`);
  }

  getAllRapports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/documents/rapports`);
  }

  telechargerDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/documents/telecharger/${id}`, {
      responseType: 'blob'
    });
  }

  changerStatutDocument(id: number, statut: string, commentaire?: string): Observable<any> {
    let url = `${this.baseUrl}/documents/${id}/statut?statut=${statut}`;
    if (commentaire) url += `&commentaire=${encodeURIComponent(commentaire)}`;
    return this.http.put(url, {});
  }
}
