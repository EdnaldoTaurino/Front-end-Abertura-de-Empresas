import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Companies } from '../../interfaces/Icompanies';
import { CompaniesService } from '../../service/companies.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  providers: [CompaniesService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  Companies: Companies[] = [];
  filteredCompanies: any[] = [];
  selectedCompany: Companies | null = null;

  constructor(
    private companiesService: CompaniesService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void {
    axios
      .get<Companies[]>('http://localhost:3000/empresas')
      .then((response) => {
        console.log('Dados recebidos via GET: ', response.data);
        this.Companies = response.data;
        this.filteredCompanies = this.Companies.filter(
          (company) => company.solicitante && company.empresa
        );
      })
      .catch((error) => {
        console.log('erro ao buscar empresas', error);
      });
  }

  getCompanyId(company: Companies) {
    axios
      .get<Companies>(`http://localhost:3000/empresas/${company.id}`)
      .then((response) => {
        this.selectedCompany = response.data;
        console.log('Dados recebidos via GET: ', response.data);
      })
      .catch((error) => {
        console.log('erro ao buscar empresa', error);
      });
  }

  editarEmpresa(company: Companies) {
    this.router.navigate(['/edit-company'], {
      queryParams: { id: company.id },
    });
  }
}
