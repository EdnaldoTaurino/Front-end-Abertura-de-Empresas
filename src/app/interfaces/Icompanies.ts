interface Solicitante {
  ds_responsavel: string;
  nu_cpf: string;
  date_nascimento: string;
}

interface Endereco {
  co_cep: number;
  ds_logradouro: string;
  co_numero: string;
  ds_complemento: string | null;
  ds_bairro: string;
  ds_municipio: string;
  co_uf: string;
}

interface EmpresaInfo {
  ds_nome_fantasia: string;
  co_entidade_registro: number;
  co_natureza_juridica: number;
  endereco: Endereco;
}

export interface Companies {
  id: string;
  solicitante: Solicitante;
  empresa: EmpresaInfo;
}

export interface EntidadeRegistro {
  key: number;
  value: string;
  id: string;
}
