import { AccountService } from '@app/services/account.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsField } from '@app/helpers/ValidatorsField';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { NgxSpinnerService } from 'ngx-spinner';
import { take } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(public fb: FormBuilder,
              public accountService: AccountService,
              private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
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
