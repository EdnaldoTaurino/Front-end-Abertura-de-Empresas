import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Companies } from '../../interfaces/Icompanies';
import { CompaniesService } from '../../service/companies.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaskCpfPipe, MaskCepPipe } from '../../../pipes/mask-cpf.pipe';
import axios from 'axios';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FormsModule, MaskCpfPipe, MaskCepPipe],
  providers: [CompaniesService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('confirmModal') confirmModal!: TemplateRef<any>;
  confirmCompany: Companies | null = null;

  companies: Companies[] = [];
  filteredCompanies: Companies[] = [];
  selectedCompany: Companies | null = null;

  constructor(
    private companiesService: CompaniesService,
    private router: Router,
    private http: HttpClient,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void {
    axios
      .get<Companies[]>('http://localhost:3000/empresas')
      .then((response) => {
        this.companies = response.data.filter(
          (company) =>
            company.solicitante?.ds_responsavel &&
            company.empresa?.ds_nome_fantasia
        );
        this.filteredCompanies = this.companies;
      })
      .catch((error) => {
        console.error('Erro ao buscar empresas: ', error);
      });
  }

  openRemoveModal(company: Companies): void {
    this.confirmCompany = company;
    this.modalService
      .open(this.confirmModal)
      .result.then(() => this.confirmRemove(company))
      .catch(() => {});
  }

  private confirmRemove(company: Companies): void {
    axios
      .delete(`http://localhost:3000/empresas/${company.id}`)
      .then(() => {
        this.companies = this.companies.filter((c) => c.id !== company.id);
        this.filteredCompanies = this.filteredCompanies.filter(
          (c) => c.id !== company.id
        );
        if (this.selectedCompany?.id === company.id) {
          this.selectedCompany = null;
        }
      })
      .catch((err) => {
        console.error('Erro ao remover empresa:', err);
        alert('Não foi possível remover a empresa.');
      });
  }

  filterCompanies(criteria: string): void {
    this.filteredCompanies = this.companies.filter(
      (company) =>
        company.empresa.ds_nome_fantasia
          .toLowerCase()
          .includes(criteria.toLowerCase()) ||
        company.solicitante.ds_responsavel
          .toLowerCase()
          .includes(criteria.toLowerCase())
    );
  }

  selectCompany(company: Companies): void {
    this.selectedCompany = company;
  }

  editarEmpresa(company: Companies): void {
    this.router.navigate(['/register'], { state: { company } });
  }
}
