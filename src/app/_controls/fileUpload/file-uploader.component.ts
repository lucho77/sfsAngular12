import { Component, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormdataReportdef } from 'src/app/_models/formdata';

@Component({
  selector: 'app-file-uploader',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {
    public file: any;
    @Input() form: FormGroup;
    @Input() field: FormdataReportdef;
    fileChange(input) {
        // tslint:disable-next-line:prefer-const
        let s =  this.field;
        console.log(input.files);
        const reader = new FileReader();
        if (input.files.length) {
            this.file = input.files[0].name;
            console.log(this.file);
            console.log(input.files[0]);
            const a = reader.readAsDataURL(input.files[0]);
            this.field.archivoUpload = this.file;

            reader.onload = function(e) {
                let encoded = reader.result.toString().replace(/^data:(.*;base64,)?/, '');
                console.log(encoded);
                if ((encoded.length % 4) > 0) {
                    encoded += '='.repeat(4 - (encoded.length % 4));
                }
                s.valueNew = encoded;
                console.log(s);
            };
            }
    }

    removeFile(): void {
        this.file = '';
    }

}
