import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Companies } from '../../interfaces/Icompanies';
import { CompaniesService } from '../../service/companies.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  Companies: Companies[] = [];
  constructor(private companiesService: CompaniesService) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void {
    this.companiesService.getCompanies().subscribe({
      next: (data: Companies[]) => {
        console.log('Dados recebidos MOCK: ', data);
        this.Companies = data;
      },
      error: (err: any) => console.log('erro ao buscar empresas', err),
    });
  }

  // deleteCompany(id: number): void {
  //   this.companiesService.deleteCompany(id).subscribe({
  //     next: (data: Companies) => {
  //       console.log('Empresa deletada com sucesso', data);
  //       this.getCompanies();
  //     },
  //     error: (err: any) => console.log('erro ao deletar empresa', err),
  //   });
  // }
}
