import { Injectable, Pipe } from '@angular/core';
@Pipe({
   name: 'keyobject'
})
@Injectable()
export class PipeKeyobject {

transform(value, args:string[]):any {
    let keys = [];
    keys.push({header: value['header'], value: value['value'] });    
    console.log(keys);

    return keys;
}}