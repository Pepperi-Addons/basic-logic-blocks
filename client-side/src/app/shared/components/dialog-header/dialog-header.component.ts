import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'logic-blocks-dialog-header',
    templateUrl: './dialog-header.component.html',
    styleUrls: ['./dialog-header.component.scss']
})
export class DialogHeaderComponent {
    @Input() titleResourceKey = '';
}
