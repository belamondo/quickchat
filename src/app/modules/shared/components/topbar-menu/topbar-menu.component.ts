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
  
  @Input() views;

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
    console.log(sessionStorage.getItem('userData'))
    this._auth.setUser()
      .then(res => {
        if (!res || !res['id']) {
          this._router.navigate(['/']);

          this._snackbar.open('Você precisa logar para entrar.', '', {
            duration: 4000
          })

          return false;
        }
        
        this._crud.read({
          collection: 'people',
          whereId: res['id']
        }).then(res => { 
          if (res[0]) {
            this.user = {
              name: res[0]['_data']['name'].split(' ')[0]
            }
          } else {
            this._router.navigate(['/main/profile_choice'])
          }
        })
      })
  }

  logout = () => {
    let params = {
      navigateTo: '/login'
    };

    this._auth.logout(params);
  } 
}