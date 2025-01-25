import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Companies } from '../../interfaces/Icompanies';
import { CompaniesService } from '../../service/companies.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  providers: [CompaniesService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  Companies: Companies[] = [];
  filteredCompanies: any[] = [];
  selectedCompany: Companies | null = null;

  constructor(
    private companiesService: CompaniesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void {
    this.companiesService.getCompanies().subscribe({
      next: (data: Companies[]) => {
        console.log('Dados recebidos MOCK: ', data);
        this.Companies = data;
        this.filteredCompanies = this.Companies.filter(
          (company) => company.solicitante && company.empresa
        );
      },
      error: (err: any) => console.log('erro ao buscar empresas', err),
    });
  }

  visualizarEmpresa(company: Companies) {
    this.selectedCompany = company;
  }

  editarEmpresa() {
    this.router.navigate(['/edit-company'], {
      queryParams: { company: JSON.stringify(this.selectedCompany) },
    });
  }
}
