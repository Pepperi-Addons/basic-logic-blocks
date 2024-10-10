import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'logic-blocks-dialog-actions',
    templateUrl: './dialog-actions.component.html',
    styleUrls: ['./dialog-actions.component.scss']
})
export class DialogActionsComponent {
    @Input() doneIsDisabled = true;
    @Input() currentConfiguration: any = null;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
  
    onCloseDialogClick(event) {
        this.hostEvents.emit({
            type: 'close-dialog'
        });
        // debugger;
        this.hostEvents.emit({
            type: 'afterClosed'
        });
    }
    
    onDoneClick(event) {
        this.hostEvents.emit({
            type: 'set-configuration',
            configuration: this.currentConfiguration
        });
    }

    // @Output() closeClick: EventEmitter<void> = new EventEmitter<void>();
    // @Output() doneClick: EventEmitter<void> = new EventEmitter<void>();
  
    // onCloseDialogClick(event) {
    //     this.closeClick.emit();
    // }
    
    // onDoneClick(event) {
    //     this.doneClick.emit();
    // }
}
