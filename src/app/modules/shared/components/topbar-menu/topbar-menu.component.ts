import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input
} from '@angular/core';
import {
  MediaMatcher, 
  BreakpointObserver, 
  Breakpoints
} from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/**
 * Services
 */
import { AuthenticationService } from './../../services/firebase/authentication.service';
import { CrudService } from './../../services/firebase/crud.service';

@Component({
  selector: 'topbar-menu',
  templateUrl: './topbar-menu.component.html',
  styleUrls: ['./topbar-menu.component.css']
})
export class TopbarMenuComponent implements OnInit {
  private _mobileQueryListener: () => void;
  public mobileQuery: MediaQueryList;
  public mobile = (typeof window !== 'undefined') ?
  (window.screen.availWidth < 800) :
  true;

  public options: any;
  public user: any;
  public userData: any;

  @Input() params;

  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService,
    private _router: Router,
    public _snackbar: MatSnackBar,
    public breakpointObserver: BreakpointObserver,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

    this
      .mobileQuery
      .addListener(this._mobileQueryListener);

    this.options = {
      fixed: 'fixed', // Define the sidenav style, possible values are 'fixed' and 'Non-fixed'
      opened: !this.mobileQuery.matches, // Possible values are true or false
      mode: 'auto', // Define the sidenav mode, possible values are push, side and over
      top: 56, // Css 'top' from sidenav
      bottom: 0, // Css 'bottom' from sidenav
      userCard: true
    };

    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(mobile => {
      this.options.opened = !mobile.matches;
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this
      .mobileQuery
      .removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));

    if(this.userData) {
      this._crud.read({
        collectionsAndDocs: [this.userData[0]['userType'],this.userData[0]['_id']]
      }).then(res => {
        this.user = res[0];
      });
    }
  }

  logout = () => {
    let params = {
      navigateTo: '/login'
    };

    this._auth.logout(params);
  } 
}