import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class DescriptionService {
    constructor() { }
    private descriptionChangedSource = new Subject<void>();
    public descriptionChanged$ = this.descriptionChangedSource.asObservable();
    private description: string;
    setDescription(description: string) {
      this.description = description;
      this.descriptionChangedSource.next();
      }
      getDescription() {
        return this.description;
    }
}
