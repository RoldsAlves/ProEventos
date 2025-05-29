import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { Pagination, PaginatedResult } from '@app/models/Pagination';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  modalRef!: BsModalRef;

  public eventos: Evento[] = [];
  public eventosFiltered: any = [];
  public eventoTema = "";
  public eventoId = 0;
  public pagination = {} as Pagination;

  public widthImg: number = 100;
  public marginImg: number = 2;
  public showImg: boolean = false;
  private _filterList: string = '';

  public get filterList(): string {
    return this._filterList;
  }

  public set filterList(value: string) {
    this._filterList =  value;
    this.eventosFiltered = this.filterList ? this.filterEventos(this.filterList) : this.eventos;
  }

  public filterEventos(filterBy: string): Evento[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local: string; }) =>
        evento.tema.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
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
    this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe({
      next: (paginatedResult: PaginatedResult<Evento[]>) => {
        this.eventos = paginatedResult.result;
        this.eventosFiltered = this.eventos;
        this.pagination = paginatedResult.pagination;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao Carregar os Eventos.', 'Erro!')
      },
      complete: () => this.spinner.hide()
    });
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number, eventoTema: string): void {
    event?.stopPropagation();
    this.eventoTema = eventoTema;
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public pageChanged($event): void {}

  confirm(): void {
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

  decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`])
  }
}
