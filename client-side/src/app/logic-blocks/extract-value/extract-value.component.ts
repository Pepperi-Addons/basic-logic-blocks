import { TranslateService } from '@ngx-translate/core';
import { SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { ExtractValueLogicBlockService } from './extract-value.service'; 
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { ConifurationProperty } from 'shared';

export interface ExtractValueConifuration {
}

export interface ExtractValueConifurationProperty extends ConifurationProperty {
    Type: SchemeFieldType;
}

@Component({
    templateUrl: './extract-value.component.html',
    styleUrls: ['./extract-value.component.scss'],
    providers: [ExtractValueLogicBlockService]
})
export class ExtractValueLogicBlockComponent extends BaseLogicBlockDirective {
    protected accountOptions: IPepOption[] = [];
    protected catalogOptions: IPepOption[] = [];
    protected catalogStaticOptions: IPepOption[] = [];
    protected transactionTypeOptions: IPepOption[] = [];
    protected transactionTypeStaticOptions: IPepOption[] = [];
    
    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: ExtractValueLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService,
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    private loadOptions() {
        // const stringFlowParamsOptions = this.logicBlockService.getFlowParametersOptions('String');

        // this.accountOptions = stringFlowParamsOptions;
        // this.catalogOptions = stringFlowParamsOptions;
        // this.logicBlockService.getCatalogsOptions(this.currentConfiguration).then((catalogsOptions: IPepOption[]) => {
        //     this.catalogStaticOptions = catalogsOptions; 
        // });

        // this.transactionTypeOptions = stringFlowParamsOptions;
        // this.logicBlockService.getTransactionTypeOptions().then((transactionTypeOptions: IPepOption[]) => {
        //     this.transactionTypeStaticOptions = transactionTypeOptions; 
        // });

    }

    // Do nothing here the init implementation is in the loadDataOnInit function.
    // ngOnInit(): void { }

    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/

    protected onAccountChoose(accountUUID: string) {
        //this.onPropertyValueChange(accountUUID, this.currentConfiguration.Account);
    }

    /**************************************************************************************/
    /*                            Implements abstract functions.
    /**************************************************************************************/

    get currentConfiguration(): ExtractValueConifuration {
        return this._currentConfiguration as ExtractValueConifuration;
    }

    protected getTitleResourceKey(): string {
        return 'EXTRACT_VALUE.TITLE';
    }

    valueChange(event: any) {
        console.log(event);
    }

    protected loadDataOnInit(): void {
        const defaultConfiguration = this.createDefaultConfiguration();
        // if (!this.currentConfiguration.Account) {
        //     this.currentConfiguration.Account = defaultConfiguration.Account;
        // }
        // if (!this.currentConfiguration.Catalog) {
        //     this.currentConfiguration.Catalog = defaultConfiguration.Catalog;
        // }
        // if (!this.currentConfiguration.TransactionType) {
        //     this.currentConfiguration.TransactionType = defaultConfiguration.TransactionType;
        // }

        this.loadOptions();
    }

    protected createDefaultConfiguration(): ExtractValueConifuration {
        const config: ExtractValueConifuration = {
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
        return true;
        //return !this.currentConfiguration.Account.Value || !this.currentConfiguration.Catalog.Value || !this.currentConfiguration.TransactionType.Value;
    }
     
}
