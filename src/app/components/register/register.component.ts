import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { z } from 'zod';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  validationErrors: { [key: string]: string } = {};
  entidadeRegistroOptions: any[] = [];
  estados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      ds_responsavel: ['', Validators.required],
      nu_cpf: ['', Validators.required],
      date_nascimento: ['', Validators.required],
      ds_nome_fantasia: ['', Validators.required],
      co_entidade_registro: ['', Validators.required],
      co_cep: ['', Validators.required],
      ds_logradouro: ['', Validators.required],
      ds_complemento: [''],
      ds_bairro: ['', Validators.required],
      ds_municipio: ['', Validators.required],
      co_uf: ['', Validators.required],
    });
  }
  // Entidade de Registro
  ngOnInit(): void {
    this.fetchEntidadeRegistroOptions();
    this.fetchEstados();
  }

  fetchEntidadeRegistroOptions(): void {
    this.http.get<any[]>('http://localhost:3000/entidade-registro').subscribe({
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

  validateForm(): boolean {
    const schema = z.object({
      ds_responsavel: z.string().nonempty('Este campo é obrigatório.'),
      nu_cpf: z.string().nonempty('Este campo é obrigatório.'),
      date_nascimento: z.string().nonempty('Este campo é obrigatório.'),
      ds_nome_fantasia: z.string().nonempty('Este campo é obrigatório.'),
      co_entidade_registro: z
        .union([z.string().nonempty('Este campo é obrigatório.'), z.number()])
        .transform(String),
      co_cep: z.string().nonempty('Este campo é obrigatório.'),
      ds_logradouro: z.string().nonempty('Este campo é obrigatório.'),
      ds_complemento: z.string().optional(),
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

  onSubmit(): void {
    if (this.validateForm()) {
      const formData = {
        solicitante: {
          ds_responsavel: this.registerForm.value.ds_responsavel,
          nu_cpf: this.registerForm.value.nu_cpf,
          date_nascimento: this.registerForm.value.date_nascimento,
        },
        empresa: {
          ds_nome_fantasia: this.registerForm.value.ds_nome_fantasia,
          co_entidade_registro: this.registerForm.value.co_entidade_registro,
          endereco: {
            co_cep: this.registerForm.value.co_cep,
            ds_logradouro: this.registerForm.value.ds_logradouro,
            ds_complemento: this.registerForm.value.ds_complemento,
            ds_bairro: this.registerForm.value.ds_bairro,
            ds_municipio: this.registerForm.value.ds_municipio,
            co_uf: this.registerForm.value.co_uf,
          },
        },
      };

      axios
        .post('http://localhost:3000/empresas', formData)
        .then((response) => {
          console.log('Dados enviados com sucesso: ', response.data);
          // Redirecionar para a página inicial após o envio bem-sucedido
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          console.error('Erro ao enviar dados: ', error);
        });
    } else {
      console.log('Form is invalid');
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? control.invalid && control.touched : false;
  }
}
