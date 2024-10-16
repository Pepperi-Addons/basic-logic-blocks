import { Injectable } from '@angular/core';
import { PepDialogData, PepDialogService, PepDialogActionButton, PepDialogSizeType } from '@pepperi-addons/ngx-lib/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogRef;

  constructor(
    private dialogService: PepDialogService
  ) { }


  openDialog(title: string, content: ComponentType<any>, buttons: Array<PepDialogActionButton>, input: any, callbackFunc?: (any) => void, sizeType: PepDialogSizeType = 'regular'): void {
    //const dialogConfig = this.dialogService.getDialogConfig({ disableClose: false, panelClass: 'pepperi-standalone' }, 'inline')
    const dialogConfig = this.dialogService.getDialogConfig({}, sizeType)
    const data = new PepDialogData({ title: title, actionsType: 'custom', showClose : true, showHeader : true, content: content, actionButtons: buttons })
    dialogConfig.data = data;

    this.dialogRef = this.dialogService.openDialog(content, input, dialogConfig);
    if (callbackFunc) {
      this.dialogRef.afterClosed().subscribe(res => {
        callbackFunc(res);
      });
    }
  }

  openOKDialog(title: string,  input: any, callbackFunc?:  (any) => Promise<void>)
  {
    const dialogConfig = this.dialogService.getDialogConfig({}, 'inline')
    const data = new PepDialogData({ title: title, actionsType: 'close',content: input,  showClose : false, showHeader : true})
    dialogConfig.data = data;

    this.dialogRef = this.dialogService.openDefaultDialog(data,dialogConfig);
    if (callbackFunc) {
      this.dialogRef.afterClosed().subscribe(async (res) => {
        callbackFunc(res);
      });
    }

  }

  openCancelContinueDialog(title: string,  input: any, callbackFunc?: (any) => Promise<void>)
  {
    const dialogConfig = this.dialogService.getDialogConfig({}, 'inline')
    const data = new PepDialogData({ title: title, actionsType: 'cancel-continue',content: input, showClose : false, showHeader : true})
    dialogConfig.data = data;

    this.dialogRef = this.dialogService.openDefaultDialog(data,dialogConfig);
    if (callbackFunc) {
      this.dialogRef.afterClosed().subscribe(res => {
        callbackFunc(res);
      });
    }

  }

}
