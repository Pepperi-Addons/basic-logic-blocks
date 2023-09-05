import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { NavigateToLogicBlockService } from './navigate-to.service';
import { ActivitiesViewsType, FlowParamSource, NavigateToActivitiesConifuration, NavigateToObjectConifuration, 
    NavigateToStaticConifuration, NavigateToTransactionConifuration, NavigationType, TransactionViewsType, NavigateToConfiguration, 
    NavigateToConifurationProperty, isObjectNavigationType } from 'shared';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';

@Component({
    templateUrl: './navigate-to.component.html',
    styleUrls: ['./navigate-to.component.scss'],
    providers: [NavigateToLogicBlockService]
})
export class NavigateToLogicBlockComponent extends BaseLogicBlockDirective {
    protected navigationToTypeOptions: IPepOption[] = [];
    protected stringFlowParamsOptions: IPepOption[] = [];
    protected slugStaticOptions: IPepOption[] = [];
    protected activitiesListOptions: IPepOption[] = [];
    protected transactionViewListOptions: IPepOption[] = [];

    protected objectTypeResourcesMap = new Map<string, string>();

    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: NavigateToLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    private loadResources() {
        this.translate.get('NAVIGATE_TO.OBJECT_TYPE.ACCOUNT_DASHBOARD_TITLE').subscribe((res: any) => {
            this.objectTypeResourcesMap.set('Account Dashboard', this.translate.instant('NAVIGATE_TO.OBJECT_TYPE.ACCOUNT_DASHBOARD_TITLE'));
            this.objectTypeResourcesMap.set('Activity', this.translate.instant('NAVIGATE_TO.OBJECT_TYPE.ACTIVITY_TITLE'));
            this.objectTypeResourcesMap.set('Custom', this.translate.instant('NAVIGATE_TO.OBJECT_TYPE.CUSTOM_TITLE'));
            this.objectTypeResourcesMap.set('Slug', this.translate.instant('NAVIGATE_TO.OBJECT_TYPE.SLUG_TITLE'));
            this.objectTypeResourcesMap.set('Survey', this.translate.instant('NAVIGATE_TO.OBJECT_TYPE.SURVEY_TITLE'));
        });
    }

    private loadNavigationToTypeOptions() {
        this.translate.get('NAVIGATE_TO.NAVIGATION_TYPE.HOME').subscribe((res: any) => {
            this.navigationToTypeOptions = new Array<IPepOption>();
            this.navigationToTypeOptions.push({ key: 'Account Dashboard', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.ACCOUNT_DASHBOARD') });
            this.navigationToTypeOptions.push({ key: 'Accounts', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.ACCOUNTS') });
            this.navigationToTypeOptions.push({ key: 'Activities', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.ACTIVITIES') });
            this.navigationToTypeOptions.push({ key: 'Activity', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.ACTIVITY') });
            this.navigationToTypeOptions.push({ key: 'Back', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.BACK') });
            this.navigationToTypeOptions.push({ key: 'Contacts', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.CONTACTS') });
            this.navigationToTypeOptions.push({ key: 'Custom', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.CUSTOM') });
            this.navigationToTypeOptions.push({ key: 'Home', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.HOME') });
            this.navigationToTypeOptions.push({ key: 'Items', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.ITEMS') });
            this.navigationToTypeOptions.push({ key: 'Slug', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.SLUG') });
            this.navigationToTypeOptions.push({ key: 'Survey', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.SURVEY') });
            this.navigationToTypeOptions.push({ key: 'Transaction', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.TRANSACTION') });
            this.navigationToTypeOptions.push({ key: 'Users', value: this.translate.instant('NAVIGATE_TO.NAVIGATION_TYPE.USERS') });
        });
    }

    private loadTransactionViewListOptions() {
        this.translate.get('NAVIGATE_TO.TRANSACTION_TYPE.ORDER_CENTER').subscribe((res: any) => {
            this.transactionViewListOptions = new Array<IPepOption>();
            this.transactionViewListOptions.push({ key: 'Cart', value: this.translate.instant('NAVIGATE_TO.TRANSACTION_TYPE.CART') });
            this.transactionViewListOptions.push({ key: 'Header', value: this.translate.instant('NAVIGATE_TO.TRANSACTION_TYPE.HEADER') });
            this.transactionViewListOptions.push({ key: 'Item Details', value: this.translate.instant('NAVIGATE_TO.TRANSACTION_TYPE.ITEM_DETAILS') });
            this.transactionViewListOptions.push({ key: 'Matrix', value: this.translate.instant('NAVIGATE_TO.TRANSACTION_TYPE.MATRIX') });
            this.transactionViewListOptions.push({ key: 'Order Center', value: this.translate.instant('NAVIGATE_TO.TRANSACTION_TYPE.ORDER_CENTER') });
        });
    }

    private loadOptions() {
        this.stringFlowParamsOptions = this.logicBlockService.getFlowParametersOptions('String');
        
        this.loadNavigationToTypeOptions();
        this.loadTransactionViewListOptions();

        this.logicBlockService.getSlugOptions().then((slugOptions: IPepOption[]) => {
            this.slugStaticOptions = slugOptions;
        });

        this.logicBlockService.getActivitiesListOptions().then((activitiesListOptions: IPepOption[]) => {
            this.activitiesListOptions = activitiesListOptions;
        });
    }

    private isStaticNavigationType(type: NavigationType): boolean {
        return type === 'Home' || 
               type === 'Back' || 
               type === 'Accounts' || 
               type === 'Users' || 
               type === 'Contacts' || 
               type === 'Items';
    }

    protected isObjectNavigationType(type: NavigationType): boolean {
        return isObjectNavigationType(type);
    }

    protected onNavigationTypeChange(value: NavigationType) {
        if (this.isStaticNavigationType(value)) {
            this._currentConfiguration.Data = {
                Type: value
            } as NavigateToStaticConifuration;
        } else if (this.isObjectNavigationType(value)) {
            this._currentConfiguration.Data = {
                Type: value,
                ObjectData: { FlowParamSource: 'Static', Value: null },
            } as NavigateToObjectConifuration;
        } else if (value === 'Activities') {
            this._currentConfiguration.Data = {
                Type: value,
                ViewType: '',
                ActivitiesData: { Value: null }
            } as NavigateToActivitiesConifuration;
        } else if (value === 'Transaction') {
            this._currentConfiguration.Data = {
                Type: value,
                ViewType: '',
                TransactionData: { FlowParamSource: 'Static', Value: null },
                ChildTransactionData: { FlowParamSource: 'Static', Value: null },
                QsTransactionData: { FlowParamSource: 'Static', Value: null },
            } as NavigateToTransactionConifuration;
        }

        super.validateData();
    }

    // Do nothing here the init implementation is in the loadDataOnInit function.
    // ngOnInit(): void { }

    onPropertyViewTypeChange(value: ActivitiesViewsType | TransactionViewsType, configurationProperty: NavigateToConifurationProperty, initValue = true) {
        if (this._currentConfiguration.Data.ViewType !== value) {
            this._currentConfiguration.Data.ViewType = value;
    
            if (initValue) {
                configurationProperty.Value = null;
            }
    
            super.validateData();
        }
    }

    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/

    protected onAccountChoose(accountUUID: string) {
        this.onPropertyValueChange(accountUUID, (this._currentConfiguration.Data as NavigateToObjectConifuration).ObjectData);
    }

    /**************************************************************************************/
    /*                            Implements abstract functions.
    /**************************************************************************************/

    get currentConfiguration(): NavigateToConfiguration {
        return this._currentConfiguration;
    }

    protected getTitleResourceKey(): string {
        return 'NAVIGATE_TO.TITLE';
    }

    protected loadDataOnInit(): void {
        this.loadResources();
        this.loadOptions();
    }

    protected createDefaultConfiguration(): NavigateToConfiguration {
        const config: NavigateToConfiguration = {
            Data: {}
        };
        return config;
    }
    
    protected calculateDoneIsDisabled(): boolean {
        let isDisabled = false;

        if (this._currentConfiguration === null) {
            isDisabled = true;
        } else if (this.isObjectNavigationType(this._currentConfiguration.Data.Type)) {
            isDisabled = !(this._currentConfiguration.Data as NavigateToObjectConifuration).ObjectData?.Value;
        } else if (this._currentConfiguration.Data.Type === 'Activities') {
            const tmp = this._currentConfiguration.Data as NavigateToActivitiesConifuration;
            isDisabled = (tmp.ViewType === 'Single List' || tmp.ViewType === '') && !tmp.ActivitiesData?.Value;
        } else if (this._currentConfiguration.Data.Type === 'Transaction') {
            const tmp = this._currentConfiguration.Data as NavigateToTransactionConifuration;
            isDisabled = tmp.ViewType === '' || !tmp.TransactionData?.Value || 
                ((tmp.ViewType === 'Item Details' || tmp.ViewType === 'Matrix') && !tmp.ChildTransactionData?.Value);
        }

        return isDisabled;
    }

}
