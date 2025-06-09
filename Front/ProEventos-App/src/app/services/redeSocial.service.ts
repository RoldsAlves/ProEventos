import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RedeSocial } from '@app/models/RedeSocial';
import { environment } from '@environments/environment';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedeSocialService {
  baseURL = environment.apiURL + 'api/redeSocial';

  constructor(private http: HttpClient) { }

  /**
   * 
   * @param origem Precisa passar a palvra 'palestrante' ou 'evento' - Escrito em minúsculo.
   * @param id Precisa passar o PalestranteId ou EventoId dependendo da sua Origem
   * @returns Observable<RedeSocial[]>
   */
  public getRedesSociais(origem: string, id: number): Observable<RedeSocial[]> {
    let URL = id === 0 ? `${this.baseURL}/${origem}` : `${this.baseURL}/${origem}/${id}`;
    
    return this.http.get<RedeSocial[]>(URL).pipe(take(1));
  }

  /**
   * 
   * @param origem Precisa passar a palvra 'palestrante' ou 'evento' - Escrito em minúsculo.
   * @param id Precisa passar o PalestranteId ou EventoId dependendo da sua Origem
   * @param redesSociais precisa adicionar Redes Sociais organizadas em RedeSocial[]
   * @returns Observable<RedeSocial[]>
   */
  public saveRedeSocial(origem: string, id: number, redesSociais: RedeSocial[]): Observable<RedeSocial[]> {
    let URL = id === 0 ? `${this.baseURL}/${origem}` : `${this.baseURL}/${origem}/${id}`;
    
    return this.http.put<RedeSocial[]>(URL, redesSociais).pipe(take(1));
  }

  /**
   * 
   * @param origem Precisa passar a palvra 'palestrante' ou 'evento' - Escrito em minúsculo.
   * @param id Precisa passar o PalestranteId ou EventoId dependendo da sua Origem
   * @param redeSocialId precisa usar o id da Rede Social
   * @returns Observable<any> - pois é o retorno da rota
   */
  public deleteRedeSocial(origem: string, id: number, redeSocialId: number): Observable<any> {
    let URL = id === 0 ? `${this.baseURL}/${origem}/${redeSocialId}` : `${this.baseURL}/${origem}/${id}/${redeSocialId}`;
    
    return this.http.delete<RedeSocial[]>(URL).pipe(take(1));
  }

}
