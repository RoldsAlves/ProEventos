import { AccountService } from '@app/services/account.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  public usuario = {} as UserUpdate;
  public file: File;
  public imagemURL = '';

  public get isPalestrante(): boolean {
    return this.usuario.userFunction === 'Palestrante';
  }

  constructor(private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private accountService: AccountService
  ) { }

  ngOnInit(): void {
  }

  public getFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;
    if(this.usuario.imageURL)
      this.imagemURL = environment.apiURL + `resources/perfil/${this.usuario.imageURL}`;
    else
      this.imagemURL = './assets/image/profile.png'
  }

  onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result; //Gera evento que carrega a imagem na view

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);
    this.uploadImagem();
  }

  private uploadImagem(): void {
    this.spinner.show();
    this.accountService.postUpload(this.file).subscribe(
      () => this.toastr.success('Imagem autalizada com Sucesso', 'Sucesso!'),
      (error: any) => {
        this.toastr.error('Erro ao realizar upload da Imagem', 'Erro!');
        console.error(error);
      },
    ).add(() => this.spinner.hide());
  }

}