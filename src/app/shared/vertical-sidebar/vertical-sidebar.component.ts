import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuService } from './menu.service';
import { VerticalSidebarService } from './vertical-sidebar.service';



@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html',
  styleUrls: ['./vertical-sidebar.component.scss'],
  providers: [ MenuService ]

})
export class VerticalSidebarComponent implements OnInit {
  public dataUser={name:'',mail:''};
  public sidebarnavItems: [] = [];
  showMenu = '';
  showSubMenu = '';
  items: MenuItem[];
  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor( private router: Router) {
  }



  ejecutarMenu(ejecutar:string){
    const url = '/full/home/reportdef';
    localStorage.setItem('currentMenuClick',ejecutar );
    this.router.navigate([url, ejecutar]);
    this.handleNotify();
  }
  prueba(event:any){
    const params = event.item.id.split('-');
    if(params.length >1 ){
        this.ejecutarMenu(params[1]);
    }
  }

  ngOnInit(): void {
    const theCallback = (event: any) => {
      this.prueba(event);
    }

      const user = JSON.parse(localStorage.getItem('currentUser'));
    this.dataUser.name = user['username'];
    //this.dataUser.mail =user['mail']||'agregar mail';
    const menuDTO = JSON.parse(localStorage.getItem('userMenu'));
  
      this.items = menuDTO;
      this.ponerCommand(this.items,theCallback)
      console.log(this.items);
      }
  

ponerCommand(list:any, fu:any){
  for (const f of list) {
     if(f.items.length >0){
      this.ponerCommand(f.items,fu)
    }else{
      f.command= fu;
    }
  }

}

handleNotify() {
  this.notify.emit(false);
}
}
