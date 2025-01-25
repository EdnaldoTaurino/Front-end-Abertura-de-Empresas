import { MaskCpfPipe } from './mask-cpf.pipe';

describe('MaskCpfPipe', () => {
  it('create an instance', () => {
    const pipe = new MaskCpfPipe();
    expect(pipe).toBeTruthy();
  });
});
