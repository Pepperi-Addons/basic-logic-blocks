import { TranslateService } from '@ngx-translate/core';
import { SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { ActiveTransactionLogicBlockService } from './active-transaction.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockComponent } from 'src/app/shared/components/base-logic-block.component.ts/base-logic-block.component';

export interface ActiveTransactionConifuration {
    Account: ActiveTransactionConifurationProperty;
    Catalog: ActiveTransactionConifurationProperty;
    TransactionType: ActiveTransactionConifurationProperty;
    Status: ActiveTransactionConifurationProperty;
}

export type FlowParamSource = 'Static' | 'Dynamic'

export interface ActiveTransactionConifurationProperty {
    FlowParamSource: FlowParamSource;
    Type: SchemeFieldType;
    Value: any;
}

@Component({
    templateUrl: './active-transaction.component.html',
    styleUrls: ['./active-transaction.component.scss'],
    providers: [ActiveTransactionLogicBlockService]
})
export class ActiveTransactionLogicBlockComponent extends BaseLogicBlockComponent {
    protected accountOptions: IPepOption[] = [];
    protected catalogOptions: IPepOption[] = [];
    protected catalogStaticOptions: IPepOption[] = [];
    protected transactionTypeOptions: IPepOption[] = [];
    protected transactionTypeStaticOptions: IPepOption[] = [];
    protected statusOptions: IPepOption[] = [];
    protected statusStaticOptions: IPepOption[] = [];
    
    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: ActiveTransactionLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService,
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    private loadOptions() {
        const stringFlowParamsOptions = this.logicBlockService.getFlowParametersOptions('String');

        this.accountOptions = stringFlowParamsOptions;
        this.catalogOptions = stringFlowParamsOptions;
        this.logicBlockService.getCatalogsOptions(this.currentConfiguration).then((catalogsOptions: IPepOption[]) => {
            this.catalogStaticOptions = catalogsOptions; 
        });

        this.transactionTypeOptions = stringFlowParamsOptions;
        this.logicBlockService.getTransactionTypeOptions().then((transactionTypeOptions: IPepOption[]) => {
            this.transactionTypeStaticOptions = transactionTypeOptions; 
        });

        this.statusOptions = stringFlowParamsOptions;
        this.logicBlockService.getStatusOptions().then((statusOptions: IPepOption[]) => {
            this.statusStaticOptions = statusOptions;
        });
    }

    // Do nothing here the init implementation is in the loadDataOnInit function.
    // ngOnInit(): void { }

    // onFlowParamSourceChange(value: FlowParamSource, configurationProperty: ActiveTransactionConifurationProperty) {
    //     configurationProperty.FlowParamSource = value;
    //     configurationProperty.Value = null;
    //     super.validateData();
    // }

    // onPropertyValueChange(value: string, configurationProperty: ActiveTransactionConifurationProperty) {
    //     configurationProperty.Value = value;
    //     super.validateData();
    // }

    // chooseAccountClick(value) {
    //     this.dialogRef = this.addonBlockService.loadAddonBlockInDialog({
    //         container: this.viewContainerRef,
    //         name: 'List',
    //         hostObject: this.accountsHostObject,
    //         hostEventsCallback: async ($event) => {
    //             if($event.action === 'on-done') {
    //                 this._currentConfiguration.Account.Value = $event.data.selectedObjects[0];
    //                 super.validateData();
    //                 this.dialogRef.close();
    //             } else if($event.action === 'on-cancel') {
    //                 this.dialogRef.close();
    //             }
    //         }
    //     });
    // }

    // closeDialogClick(value) {
    //     this.hostEvents.emit({
    //         type: 'close-dialog'
    //     });
    // }
    
    // doneClick(value) {
    //     this.hostEvents.emit({
    //         type: 'set-configuration',
    //         configuration: this._currentConfiguration
    //     });
    // }

    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/

    protected onAccountChoose(accountUUID: string) {
        this.onPropertyValueChange(accountUUID, this.currentConfiguration.Account);
    }

    /**************************************************************************************/
    /*                            Implements abstract functions.
    /**************************************************************************************/

    get currentConfiguration(): ActiveTransactionConifuration {
        return this._currentConfiguration as ActiveTransactionConifuration;
    }

    protected loadDataOnInit(): void {
        const defaultConfiguration = this.createDefaultConfiguration();
        if (!this.currentConfiguration.Account) {
            this.currentConfiguration.Account = defaultConfiguration.Account;
        }
        if (!this.currentConfiguration.Catalog) {
            this.currentConfiguration.Catalog = defaultConfiguration.Catalog;
        }
        if (!this.currentConfiguration.TransactionType) {
            this.currentConfiguration.TransactionType = defaultConfiguration.TransactionType;
        }
        if (!this.currentConfiguration.Status) {
            this.currentConfiguration.Status = defaultConfiguration.Status;
        }

        this.loadOptions();
    }

    protected createDefaultConfiguration(): ActiveTransactionConifuration {
        const config: ActiveTransactionConifuration = {
            Account: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            },
            Catalog: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            },
            TransactionType: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            },
            Status: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            }
        };

        return config;
    }
    
    protected calculateDoneIsDisabled(): boolean {
        return !this.currentConfiguration.Account.Value || !this.currentConfiguration.Status.Value;
    }
     
}
