import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RedeSocial } from '@app/models/RedeSocial';
import { RedeSocialService } from '@app/services/redeSocial.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-redesSociais',
  templateUrl: './redesSociais.component.html',
  styleUrls: ['./redesSociais.component.scss']
})
export class RedesSociaisComponent implements OnInit {
  modalRef: BsModalRef;
  @Input() eventoId = 0;
  public formRS: FormGroup;
  public redeSocialAtual = { id: 0, nome: '', indice: 0 }

  public get redesSociais(): FormArray {
    return this.formRS.get('redesSociais') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private redeSocialService: RedeSocialService
  ) {}

  ngOnInit() {
    this.carregarRedesSociais(this.eventoId);
    this.validation();
  }

  private carregarRedesSociais(id: number = 0): void {
    let origem = 'palestrante';
    if(this.eventoId !== 0) origem = 'evento';

    this.spinner.show();
    this.redeSocialService.getRedesSociais(origem, id).subscribe(
      (redeSocialRetorno: RedeSocial[]) => {
        redeSocialRetorno.forEach((redeSocial) => {
          this.redesSociais.push(this.criarRedeSocial(redeSocial))
        });
      },
      (error: any) => {
        this.toastr.error('Erro ao tentar carregar Rede Social', 'Error!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  public validation(): void {
    this.formRS = this.fb.group({
      redesSociais: this.fb.array([])
    })
  }

  adicionarRedeSocial(): void {
    this.redesSociais.push(this.criarRedeSocial({ id: 0 } as RedeSocial));
  }

  criarRedeSocial(redeSocial: RedeSocial): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  public retornaTitulo(nome: string) {
    return nome === null || nome === '' ? 'Rede Social' : nome;
  }
  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched};
  }

  public salvarRedesSociais(): void {
    let origem = 'palestrante';
    if(this.eventoId !== 0) origem = 'evento';

    this.spinner.show();
    if(this.formRS.controls['redesSociais'].valid) {
      this.redeSocialService.saveRedeSocial(origem, this.eventoId, this.formRS.value.redesSociais).subscribe(
        () => {
          this.toastr.success('Redes Sociais salvas com Sucesso!', 'Sucesso!');
          // this.redesSociais.reset();
        },
        (error: any) => {
          this.toastr.error('Erro ao tentar salvar Redes Sociais.', 'Erro!');
          console.error(error);
        },
      ).add(() => this.spinner.hide());
    }
  }

  public removerRedeSocial(template: TemplateRef<any>,indice: number): void {
    this.redeSocialAtual.id = this.redesSociais.get(indice + '.id').value;
    this.redeSocialAtual.nome = this.redesSociais.get(indice + '.nome').value;
    this.redeSocialAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirmDeleteRedeSocial(): void {
    let origem = 'palestrante';
    this.modalRef.hide();
    this.spinner.show();

    if(this.eventoId !== 0) origem = 'evento';

    this.redeSocialService.deleteRedeSocial(origem, this.eventoId, this.redeSocialAtual.id).subscribe(
      () => {
        this.toastr.success('Rede Social deletada com Sucesso.', 'Sucesso!');
        this.redesSociais.removeAt(this.redeSocialAtual.indice);
      },
      (error: any) => {
        this.toastr.error(`Erro ao deletar Rede Social ${this.redeSocialAtual.id}.`, 'Erro!');
        console.error(error);
      },
    ).add(() => this.spinner.hide());
  }

  declineDeleteRedeSocial(): void {
    this.modalRef.hide();
  }

  labelRedeSocial(value: string): string {
    const map: { [key: string]: string } = {
      'fa-brands fa-youtube': 'Youtube',
      'fa-brands fa-instagram': 'Instagram',
      'fa-brands fa-facebook': 'Facebook',
      'fa-brands fa-twitter': 'Twitter',
      'fa-brands fa-google': 'Google',
      'fa-brands fa-linkedin': 'Linkedin',
      'fa-brands fa-pinterest': 'Pinterest',
      'fa-brands fa-whatsapp': 'Whatsapp',
      'fa-brands fa-telegram': 'Telegram',
      'fa-brands fa-skype': 'Skype',
      'fa-brands fa-vimeo': 'Vimeo',
    };

    return map[value] || '';
  }

}
