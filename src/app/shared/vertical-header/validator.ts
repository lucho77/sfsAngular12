import { AbstractControl } from '@angular/forms';

export function passValidator(control: AbstractControl) {
    if (control && control.value !== null && control.valid !== undefined) {
    const cnfpassValue = control.value;

    const passControl = control.root.get('nuevaContrasena'); // la magia esta aca
    if (passControl) {
        const passValue = passControl.value;
        if (passValue !== cnfpassValue) {
            return {
                isError : true
            };
        }
    }
    return null;
    }
}
