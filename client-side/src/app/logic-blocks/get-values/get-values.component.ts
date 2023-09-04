import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { GetValuesLogicBlockService } from './get-values.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockComponent } from 'src/app/shared/components/base-logic-block.component.ts/base-logic-block.component';

export interface GetValuesConifuration {
//     Account: ActiveTransactionConifurationProperty;
//     Catalog: ActiveTransactionConifurationProperty;
//     TransactionType: ActiveTransactionConifurationProperty;
//     Status: ActiveTransactionConifurationProperty;
}

// export type FlowParamSource = 'Static' | 'Dynamic'

// export interface ActiveTransactionConifurationProperty {
//     FlowParamSource: FlowParamSource;
//     Type: SchemeFieldType;
//     Value: any;
// }

@Component({
    templateUrl: './get-values.component.html',
    styleUrls: ['./get-values.component.scss'],
    providers: [GetValuesLogicBlockService]
})
export class GetValuesLogicBlockComponent extends BaseLogicBlockComponent {
    
    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: GetValuesLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    // Do nothing here the init implementation is in the loadDataOnInit function.
    // ngOnInit(): void { }
    
    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/

    // protected onAccountChoose(accountUUID: string) {
    //     this.onPropertyValueChange(accountUUID, (this._currentConfiguration.Data as NavigateToObjectConifuration).ObjectData);
    // }

    /**************************************************************************************/
    /*                            Implements abstract functions.
    /**************************************************************************************/

    get currentConfiguration(): GetValuesConifuration {
        return this._currentConfiguration;
    }

    protected loadDataOnInit(): void {
        
    }

    protected createDefaultConfiguration(): GetValuesConifuration {
        const config: GetValuesConifuration = {
            
        };
        return config;
    }
    
    protected calculateDoneIsDisabled(): boolean {
        // let isDisabled = false;

        // return isDisabled;
        return true;
    }
}
