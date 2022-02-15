import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouteInfo } from './vertical-sidebar.metadata';
import { ROUTES } from './vertical-menu-items';


@Injectable({
    providedIn: 'root'
})
export class VerticalSidebarService {

    public screenWidth: any;
    public collapseSidebar: boolean = false;
    public fullScreen: boolean = false;

    MENUITEMS: any[] = [];

    items;

    constructor() {
    }
    public setMenu(menues:any){
        this.MENUITEMS =menues;
        this.items = new BehaviorSubject<any[]>(this.MENUITEMS);
    }
}
