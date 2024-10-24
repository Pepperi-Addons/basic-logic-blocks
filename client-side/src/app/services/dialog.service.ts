import { Injectable } from '@angular/core';
import { PepDialogData, PepDialogService, PepDialogActionButton, PepDialogSizeType } from '@pepperi-addons/ngx-lib/dialog';
import { ComponentType } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogRef;

  constructor(
    private dialogService: PepDialogService
  ) { }

  // Common function to handle dialog opening
  private openDialogInternal(
    title: string,
    content: ComponentType<any> | any,
    actionsType: 'custom' | 'close' | 'cancel-continue',
    buttons: Array<PepDialogActionButton> | null,
    input: any,
    callbackFunc?: (any) => void | Promise<void>,
    sizeType: PepDialogSizeType = 'inline',
    showClose: boolean = true,
    showHeader: boolean = true,
    isComponent: boolean = true // New parameter to specify if it's a component-based dialog
  ): void {
    const dialogConfig = this.dialogService.getDialogConfig({}, sizeType);

    const data = new PepDialogData({
      title: title,
      actionsType: actionsType,
      showClose: showClose,
      showHeader: showHeader,
      content: content, // Use the passed content or component
      actionButtons: buttons || []
    });

    dialogConfig.data = data;

    // Separate handling for components vs content-based dialogs
    if (isComponent) {
      // Use openDialog for component-based dialogs
      this.dialogRef = this.dialogService.openDialog(content as ComponentType<any>, input, dialogConfig);
    } else {
      // Use openDefaultDialog for content-based dialogs
      this.dialogRef = this.dialogService.openDefaultDialog(data, dialogConfig);
    }

    if (callbackFunc) {
      this.dialogRef.afterClosed().subscribe(async (res) => {
        await callbackFunc(res);
      });
    }
  }

  // Public Methods

  openDialog(
    title: string,
    content: ComponentType<any>,
    buttons: Array<PepDialogActionButton>,
    input: any,
    callbackFunc?: (any) => void,
    sizeType: PepDialogSizeType = 'regular'
  ): void {
    this.openDialogInternal(title, content, 'custom', buttons, input, callbackFunc, sizeType, true);
  }

  openOKDialog(
    title: string,
    input: any,
    callbackFunc?: (any) => Promise<void>
  ): void {
    this.openDialogInternal(title, input, 'close', null, input, callbackFunc, 'inline', false, true);
  }

  openCancelContinueDialog(
    title: string,
    input: any,
    callbackFunc?: (any) => Promise<void>
  ): void {
    this.openDialogInternal(title, input, 'cancel-continue', null, input, callbackFunc, 'inline', false, false);
  }

}