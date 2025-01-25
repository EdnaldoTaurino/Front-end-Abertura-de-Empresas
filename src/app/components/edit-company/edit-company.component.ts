import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Companies } from '../../interfaces/Icompanies';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-company',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css'],
})
export class EditCompanyComponent implements OnInit {
  companyForm: FormGroup;
  company!: Companies;
  companyId: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.companyForm = this.fb.group({
      ds_nome_fantasia: [''],
      ds_responsavel: [''],
      nu_cpf: [''],
      ds_logradouro: [''],
      ds_bairro: [''],
      ds_municipio: [''],
      co_cep: [''],
      ds_complemento: [''],
      co_uf: [''],
      co_numero: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.companyId = params['id'];
      this.http
        .get<Companies>(`http://localhost:3000/empresas/${this.companyId}`)
        .subscribe((company) => {
          this.company = company;
          this.companyForm.patchValue({
            ds_nome_fantasia: this.company.empresa.ds_nome_fantasia,
            ds_responsavel: this.company.solicitante.ds_responsavel,
            nu_cpf: this.company.solicitante.nu_cpf,
            ds_logradouro: this.company.empresa.endereco.ds_logradouro,
            ds_bairro: this.company.empresa.endereco.ds_bairro,
            ds_municipio: this.company.empresa.endereco.ds_municipio,
            co_cep: this.company.empresa.endereco.co_cep,
            ds_complemento: this.company.empresa.endereco.ds_complemento,
            co_uf: this.company.empresa.endereco.co_uf,
            co_numero: this.company.empresa.endereco.co_numero,
          });
        });
    });
  }

  salvarEdicao() {
    const updatedCompany = {
      ...this.company,
      empresa: {
        ...this.company.empresa,
        ...this.companyForm.value,
        endereco: {
          ...this.company.empresa.endereco,
          ...this.companyForm.value,
        },
      },
      solicitante: {
        ...this.company.solicitante,
        ...this.companyForm.value,
      },
    };

    this.http
      .put(`http://localhost:3000/empresas/${this.companyId}`, updatedCompany)
      .subscribe((response) => {
        console.log('Empresa editada:', response);
        this.router.navigate(['/home']);
      });
  }
}
