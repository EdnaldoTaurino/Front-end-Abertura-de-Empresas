import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { z } from 'zod';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    ModalModule,
    NgxMaskDirective,
  ],
  providers: [BsModalService, provideNgxMask()],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  private apiUrl = environment.apiEntidadesRegistro;
  private apiEmpresas = environment.apiEmpresas;

  registerForm: FormGroup;
  validationErrors: { [key: string]: string } = {};
  entidadeRegistroOptions: any[] = [];
  estados: any[] = [];
  modalRef?: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.registerForm = this.fb.group({
      id: [''],
      ds_responsavel: ['', Validators.required],
      nu_cpf: ['', Validators.required],
      date_nascimento: ['', Validators.required],
      ds_nome_fantasia: ['', Validators.required],
      co_entidade_registro: [0, [Validators.required, this.numberValidator()]],
      co_natureza_juridica: ['', Validators.required],
      co_cep: ['', [Validators.required, this.numberValidator()]],
      ds_logradouro: ['', Validators.required],
      co_numero: ['', Validators.required],
      ds_complemento: [''],
      ds_bairro: ['', Validators.required],
      ds_municipio: ['', Validators.required],
      co_uf: ['', Validators.required],
    });

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { company: any };
    if (state && state.company) {
      this.populateForm(state.company);
    }
  }

  ngOnInit(): void {
    this.fetchEntidadeRegistroOptions();
    this.fetchEstados();
  }

  fetchEntidadeRegistroOptions(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.entidadeRegistroOptions = data;
      },
      error: (error) => {
        console.error('Erro ao buscar opções de entidade de registro: ', error);
      },
    });
  }

  fetchEstados(): void {
    this.http
      .get<any[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'
      )
      .subscribe({
        next: (data) => {
          this.estados = data;
        },
        error: (error) => {
          console.error('Erro ao buscar estados: ', error);
        },
      });
  }

  numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return isNaN(value) ? { notNumber: 'O valor deve ser um número.' } : null;
    };
  }

  validateForm(): boolean {
    const schema = z.object({
      id: z.union([z.string(), z.number()]).optional(),
      ds_responsavel: z.string().nonempty('Este campo é obrigatório.'),
      nu_cpf: z.string().nonempty('Este campo é obrigatório.'),
      date_nascimento: z.string().nonempty('Este campo é obrigatório.'),
      ds_nome_fantasia: z.string().nonempty('Este campo é obrigatório.'),
      co_entidade_registro: z.number().nonnegative('Este campo é obrigatório.'),
      co_cep: z.number().nonnegative('O CEP deve ser um número não negativo.'),
      ds_logradouro: z.string().nonempty('Este campo é obrigatório.'),
      co_numero: z.string().optional(),
      ds_complemento: z.union([z.string(), z.null()]).optional(),
      ds_bairro: z.string().nonempty('Este campo é obrigatório.'),
      ds_municipio: z.string().nonempty('Este campo é obrigatório.'),
      co_uf: z.string().nonempty('Este campo é obrigatório.'),
    });

    try {
      schema.parse(this.registerForm.value);
      this.validationErrors = {};
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        this.validationErrors = e.errors.reduce(
          (acc: { [key: string]: string }, error) => {
            acc[error.path[0] as string] = error.message;
            return acc;
          },
          {}
        );
      }
      return false;
    }
  }

  onSubmit(template: TemplateRef<any>): void {
    if (this.validateForm()) {
      const formData = {
        id: this.registerForm.value.id || this.generateId(),
        solicitante: {
          ds_responsavel: this.registerForm.value.ds_responsavel,
          nu_cpf: this.registerForm.value.nu_cpf,
          date_nascimento: this.registerForm.value.date_nascimento,
        },
        empresa: {
          ds_nome_fantasia: this.registerForm.value.ds_nome_fantasia,
          co_entidade_registro: this.registerForm.value.co_entidade_registro,
          endereco: {
            co_cep: Number(this.registerForm.value.co_cep),
            ds_logradouro: this.registerForm.value.ds_logradouro,
            co_numero: this.registerForm.value.co_numero,
            ds_complemento: this.registerForm.value.ds_complemento,
            ds_bairro: this.registerForm.value.ds_bairro,
            ds_municipio: this.registerForm.value.ds_municipio,
            co_uf: this.registerForm.value.co_uf,
          },
        },
      };

      const companyId = this.registerForm.value.id;

      if (companyId) {
        // Atualizar empresa existente
        axios
          .put(`${this.apiEmpresas}${companyId}`, formData)
          .then((response) => {
            this.openModal(template);
          })
          .catch((error) => {
            console.error('Erro ao atualizar dados: ', error);
          });
      } else {
        // Criar nova empresa
        axios
          .post(this.apiEmpresas, formData)
          .then((response) => {
            this.openModal(template);
          })
          .catch((error) => {
            console.error('Erro ao enviar dados: ', error);
          });
      }
    } else {
      console.log('Form is invalid: ', this.validationErrors);
    }
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  closeModalAndNavigate(): void {
    if (this.modalRef) {
      this.modalRef.hide();
      this.router.navigate(['/']);
    }
  }

  populateForm(company: any): void {
    const companySchema = z.object({
      id: z.union([z.string(), z.number()]).optional(),
      solicitante: z.object({
        ds_responsavel: z.string(),
        nu_cpf: z.string(),
        date_nascimento: z.string(),
      }),
      empresa: z.object({
        ds_nome_fantasia: z.string(),
        co_entidade_registro: z.number(),
        endereco: z.object({
          co_cep: z.number(),
          ds_logradouro: z.string(),
          co_numero: z.string(),
          ds_complemento: z.union([z.string(), z.null()]).optional(),
          ds_bairro: z.string(),
          ds_municipio: z.string(),
          co_uf: z.string(),
        }),
      }),
    });

    try {
      const parsedCompany = companySchema.parse(company);
      this.registerForm.patchValue({
        id: parsedCompany.id,
        ds_responsavel: parsedCompany.solicitante.ds_responsavel,
        nu_cpf: parsedCompany.solicitante.nu_cpf,
        date_nascimento: parsedCompany.solicitante.date_nascimento,
        ds_nome_fantasia: parsedCompany.empresa.ds_nome_fantasia,
        co_entidade_registro: parsedCompany.empresa.co_entidade_registro,
        co_cep: parsedCompany.empresa.endereco.co_cep,
        ds_logradouro: parsedCompany.empresa.endereco.ds_logradouro,
        ds_complemento: parsedCompany.empresa.endereco.ds_complemento,
        ds_bairro: parsedCompany.empresa.endereco.ds_bairro,
        ds_municipio: parsedCompany.empresa.endereco.ds_municipio,
        co_uf: parsedCompany.empresa.endereco.co_uf,
        co_numero: parsedCompany.empresa.endereco.co_numero,
      });
    } catch (e) {
      console.error('Erro ao validar os dados da empresa: ', e);
    }
  }
  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  generateId(): string {
    return uuidv4();
  }
}
