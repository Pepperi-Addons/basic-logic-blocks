import { TranslateService } from '@ngx-translate/core';
import { SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { CreateTransactionLogicBlockService } from './create-transaction.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { FlowParamSource } from 'shared';

export interface CreateTransactionConifuration {
    Account: CreateTransactionConifurationProperty;
    Catalog: CreateTransactionConifurationProperty;
    TransactionType: CreateTransactionConifurationProperty;
}

export interface CreateTransactionConifurationProperty {
    FlowParamSource: FlowParamSource;
    Type: SchemeFieldType;
    Value: any;
}

@Component({
    templateUrl: './create-transaction.component.html',
    styleUrls: ['./create-transaction.component.scss'],
    providers: [CreateTransactionLogicBlockService]
})
export class CreateTransactionLogicBlockComponent extends BaseLogicBlockDirective {
    protected accountOptions: IPepOption[] = [];
    protected catalogOptions: IPepOption[] = [];
    protected catalogStaticOptions: IPepOption[] = [];
    protected transactionTypeOptions: IPepOption[] = [];
    protected transactionTypeStaticOptions: IPepOption[] = [];
    
    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: CreateTransactionLogicBlockService,
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

    get currentConfiguration(): CreateTransactionConifuration {
        return this._currentConfiguration as CreateTransactionConifuration;
    }

    protected getTitleResourceKey(): string {
        return 'CREATE_TRANSACTION.TITLE';
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

        this.loadOptions();
    }

    protected createDefaultConfiguration(): CreateTransactionConifuration {
        const config: CreateTransactionConifuration = {
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
            }
        };

        return config;
    }
    
    protected calculateDoneIsDisabled(): boolean {
        return !this.currentConfiguration.Account.Value || !this.currentConfiguration.Catalog.Value || !this.currentConfiguration.TransactionType.Value;
    }
     
}
