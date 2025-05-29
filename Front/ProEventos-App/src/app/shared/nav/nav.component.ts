import { AccountService } from '@app/services/account.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public isCollapsed = true;
  public userLogged = false;

  constructor(
    public accountService: AccountService,
    private router: Router
  ) {
    // router.events.subscribe(
    //   (val) => {
    //     if (val instanceof NavigationEnd){
    //       accountService.currentUser$.subscribe(
    //         (value) => this.userLogged = value !== null
    //       );
    //     }
    //   }
    // );
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }

}
