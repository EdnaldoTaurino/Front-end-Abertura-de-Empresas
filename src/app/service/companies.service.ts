import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Companies } from '../interfaces/Icompanies';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private apiUrl = 'http://localhost:3000/empresas';

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Companies[]> {
    return this.http.get<Companies[]>(this.apiUrl);
  }
}
