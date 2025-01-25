import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
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

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      responsiblePerson: ['', Validators.required],
      cpf: ['', Validators.required],
      birthDate: ['', Validators.required],
      companyName: ['', Validators.required],
      companyType: ['', Validators.required],
      address: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      complement: [''],
      state: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  validateForm(): boolean {
    const schema = z.object({
      responsiblePerson: z.string().nonempty('Este campo é obrigatório.'),
      cpf: z.string().nonempty('Este campo é obrigatório.'),
      birthDate: z.string().nonempty('Este campo é obrigatório.'),
      companyName: z.string().nonempty('Este campo é obrigatório.'),
      companyType: z.string().nonempty('Este campo é obrigatório.'),
      address: z.string().nonempty('Este campo é obrigatório.'),
      neighborhood: z.string().nonempty('Este campo é obrigatório.'),
      city: z.string().nonempty('Este campo é obrigatório.'),
      zipCode: z.string().nonempty('Este campo é obrigatório.'),
      complement: z.string().optional(),
      state: z.string().nonempty('Este campo é obrigatório.'),
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
      const formData = this.registerForm.value;
      axios
        .post('http://localhost:3000/empresas', formData)
        .then((response) => {
          console.log('Dados enviados com sucesso: ', response.data);
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
