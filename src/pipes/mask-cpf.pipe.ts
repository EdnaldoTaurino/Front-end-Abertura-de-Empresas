import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCpf',
})
export class MaskCpfPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}

@Pipe({
  name: 'maskCep',
})
export class MaskCepPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) {
      return '';
    }
    const cep = value.toString().padStart(8, '0');
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
}
