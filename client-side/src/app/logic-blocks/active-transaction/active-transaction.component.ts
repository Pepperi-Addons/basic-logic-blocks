import { TranslateService } from '@ngx-translate/core';
import { SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { ActiveTransactionLogicBlockService } from './active-transaction.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { FlowParamSource } from 'shared';

export interface ActiveTransactionConifuration {
    Account: ActiveTransactionConifurationProperty;
    Catalog: ActiveTransactionConifurationProperty;
    TransactionType: ActiveTransactionConifurationProperty;
    Status: ActiveTransactionConifurationProperty;
}

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
export class ActiveTransactionLogicBlockComponent extends BaseLogicBlockDirective {
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

    protected getTitleResourceKey(): string {
        return 'ACTIVE_TRANSACTIONS.TITLE';
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
