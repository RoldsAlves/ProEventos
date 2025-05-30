import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { Pagination, PaginatedResult } from '@app/models/Pagination';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  modalRef!: BsModalRef;

  public eventos: Evento[] = [];
  public eventoTema = "";
  public eventoId = 0;
  public pagination = {} as Pagination;

  public widthImg: number = 100;
  public marginImg: number = 2;
  public showImg: boolean = false;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  public filterEventos(evt: any): void {
    if(this.termoBuscaChanged.observers.length === 0){
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.eventoService.getEventos(this.pagination.currentPage,this.pagination.itemsPerPage, filtrarPor).subscribe(
            (paginatedResult: PaginatedResult<Evento[]>) => {
              this.eventos = paginatedResult.result;
              this.pagination = paginatedResult.pagination;
            },
            (error: any) => {
              this.spinner.hide();
              this.toastr.error('Erro ao Carregar os Eventos.', 'Erro!')
            },
          ).add(() => this.spinner.hide(),
        )}
      );
    }
    this.termoBuscaChanged.next(evt.value);
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.pagination = {currentPage: 1, itemsPerPage: 5, totalItems: 1} as Pagination;
    this.getEventos();
  }

  public showImage(){
    this.showImg = !this.showImg;
  }

  public mostrarImagem(imagemURL: string): string {
    return imagemURL !== ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/image/semImagem.png';
  }

  public getEventos(): void {
    this.spinner.show();
    this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
      (paginatedResult: PaginatedResult<Evento[]>) => {
        this.eventos = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      },
      (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao Carregar os Eventos.', 'Erro!')
      },
    ).add(() => this.spinner.hide());
  }

  public openModal(event: any, template: TemplateRef<any>, eventoId: number, eventoTema: string): void {
    event?.stopPropagation();
    this.eventoTema = eventoTema;
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.getEventos();
  }

  public confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: any) => {
        console.log(result);
        this.toastr.success('O Evento foi dele}tado com Sucesso.', 'Deletado!');
        this.getEventos();
      },
      error: (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`, 'Erro');
        console.error(error);
      },
    }).add(() => this.spinner.hide());

  }

  public decline(): void {
    this.modalRef.hide();
  }

  public detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`])
  }
}
