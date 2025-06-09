import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorsField } from '@app/helpers/ValidatorsField';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss']
})
export class PerfilDetalheComponent implements OnInit {
  @Output() changeFormValue = new EventEmitter();

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(public fb: FormBuilder,
              public accountService: AccountService,
              public palestranteService: PalestranteService,
              private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
    this.verificaForm();
  }

  private verificaForm(): void {
    this.form.valueChanges.subscribe(
      () => this.changeFormValue.emit({...this.form.value})
    )
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        console.log(userRetorno);
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toastr.success('Usuário Carregado', 'Sucesso');
      },
      (error: any) => {
        console.error(error);
        this.toastr.error('Usuário não Carregado.', 'Erro');
        this.router.navigate(['/dashboard']);
      },
    ).add(() => this.spinner.hide());
  }

  private validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorsField.MustMatch('password', 'passwordConfirm')
    };

    this.form = this.fb.group({
      userName: [''],
      imageURL: [''],
      title: ['NaoInformado', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      userFunction: ['NaoInformado', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(150)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', Validators.required],
    }, formOptions);
  }

  onSubmit(): void {
    // Vai parar aqui se o form estiver inválido, não permitindo a confirmação.
    this.atualizarUsuario();
  }

  public atualizarUsuario() {
    this.userUpdate = { ...this.form.value }
    this.spinner.show();

    if(this.f.userFunction.value == 'Palestrante'){
      this.palestranteService.post().subscribe(
        () => this.toastr.success('Função Palestrante ativada', 'Sucesso!'),
        (error) => {
          this.toastr.error('A função Palestrante não pode ser ativada', 'Error');
          console.error(error);
        }
      );
    }

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => this.toastr.success('Usuário atualizado!', 'Sucesso'),
      (error) => {
        this.toastr.error('Erro ao tentar atualizar Perfil', 'Erro');
        this.toastr.error(error.error);
        console.error(error)
      }
    ).add(() => this.spinner.hide());
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }
}