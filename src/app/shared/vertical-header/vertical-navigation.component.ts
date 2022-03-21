import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/_services';
import { ExitService } from 'src/app/_services/exitService';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-vertical-navigation',
  templateUrl: './vertical-navigation.component.html'
})
export class VerticalNavigationComponent implements AfterViewInit,OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;

  public dataUser={name:'',mail:''};
    // This is for Notifications
    notifications: Object[] = [
   /*
      {
        btn: 'btn-danger',
        icon: 'ti-link',
        title: 'Luanch Admin',
        subject: 'Just see the my new admin!',
        time: '9:30 AM'
      },
      {
        btn: 'btn-success',
        icon: 'ti-calendar',
        title: 'Event today',
        subject: 'Just a reminder that you have event',
        time: '9:10 AM'
      },
      {
        btn: 'btn-info',
        icon: 'ti-settings',
        title: 'Settings',
        subject: 'You can customize this template as you want',
        time: '9:08 AM'
      },
      {
        btn: 'btn-primary',
        icon: 'ti-user',
        title: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:00 AM'
      }
      */
    ];
  
    // This is for Mymessages
    mymessages: Object[] = [
      /*
      {
        useravatar: 'assets/images/users/1.jpg',
        status: 'online',
        from: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:30 AM'
      },
      {
        useravatar: 'assets/images/users/2.jpg',
        status: 'busy',
        from: 'Sonu Nigam',
        subject: 'I have sung a song! See you at',
        time: '9:10 AM'
      },
      {
        useravatar: 'assets/images/users/2.jpg',
        status: 'away',
        from: 'Arijit Sinh',
        subject: 'I am a singer!',
        time: '9:08 AM'
      },
      {
        useravatar: 'assets/images/users/4.jpg',
        status: 'offline',
        from: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:00 AM'
      } */
    ];
  

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  }

  public languages: any[] = [{
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us'
  },
  {
    language: 'French',
    code: 'fr',
    icon: 'fr'
  },
  {
    language: 'Spanish',
    code: 'es',
    icon: 'es'
  },
  {
    language: 'German',
    code: 'de',
    icon: 'de'
  }]

  constructor(private modalService: NgbModal,private translate: TranslateService,private authenticationService: AuthenticationService,
      private exitService: ExitService,private router: Router) {
    translate.setDefaultLang('en');
  }
  ngOnInit(): void {

    //throw new Error('Method not implemented.');
  }


  ngAfterViewInit() {}

  changeLanguage(lang: any) {
    this.translate.use(lang.code)
    this.selectedLanguage = lang;
  }
  salir() {
    // this.wService.logoutWS();
    this.exitService.setearExitGlobal();
    this.authenticationService.logout();
    this.router.navigate(['/']);
   }
}