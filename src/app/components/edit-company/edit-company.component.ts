import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Companies } from '../../interfaces/Icompanies';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css'],
})
export class EditCompanyComponent implements OnInit {
  companyForm: FormGroup;
  company: Companies = {} as Companies;
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
      this.company = JSON.parse(params['company']);
      this.companyId = this.company.id;
      this.companyForm.patchValue(this.company.empresa);
      this.companyForm.patchValue(this.company.solicitante);
      this.companyForm.patchValue(this.company.empresa.endereco);
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
