import { TranslateService } from '@ngx-translate/core';
import { AddonDataScheme, SchemeField, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { NavigateToLogicBlockService } from './navigate-to.service';
import { ActivitiesViewsType, FlowParamSource, NavigateToActivitiesConifuration, NavigateToObjectConifuration, 
    NavigateToStaticConifuration, NavigateToTransactionConifuration, NavigationType, TransactionViewsType, NavigateToConfiguration, 
    NavigateToConifurationProperty, isObjectNavigationType } from 'shared';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';

@Component({
    templateUrl: './navigate-to.component.html',
    styleUrls: ['./navigate-to.component.scss'],
    providers: [NavigateToLogicBlockService]
})
export class NavigateToLogicBlockComponent implements OnInit {
    @Input() hostObject: { Configuration: NavigateToConfiguration, EventData: AddonDataScheme['Fields'] };

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    private _flowParameters: AddonDataScheme['Fields'];
    
    private _currentConfiguration: NavigateToConfiguration = null;
    get currentConfiguration(): NavigateToConfiguration {
        return this._currentConfiguration;
    }
    
    private dialogRef: any;
    private accountsHostObject: any;
    
    protected parameterTypeOptions: IPepOption[] = [{ key: 'Static', value: 'Static' }, { key: 'Dynamic', value: 'Dynamic' }];
    protected navigationToTypeOptions: IPepOption[] = [];
    protected stringFlowParamsOptions: IPepOption[] = [];
    protected slugStaticOptions: IPepOption[] = [];
    protected activitiesListOptions: IPepOption[] = [];
    protected transactionViewListOptions: IPepOption[] = [];

    protected doneIsDisabled = true;
    protected objectTypeResourcesMap = new Map<string, string>();

    constructor(
        private viewContainerRef: ViewContainerRef,
        private translate: TranslateService,
        private addonBlockService: PepAddonBlockLoaderService,
        private logicBlockService: NavigateToLogicBlockService) {
    }

    private createDefaultConfiguration(): NavigateToConfiguration {
        const config: NavigateToConfiguration = {
            Data: {}
        };
        return config;
    }

    private loadResources() {
        this.translate.get('OBJECT_TYPE.ACCOUNT_DASHBOARD_TITLE').subscribe((res: any) => {
            this.objectTypeResourcesMap.set('Account Dashboard', this.translate.instant('OBJECT_TYPE.ACCOUNT_DASHBOARD_TITLE'));
            this.objectTypeResourcesMap.set('Activity', this.translate.instant('OBJECT_TYPE.ACTIVITY_TITLE'));
            this.objectTypeResourcesMap.set('Custom', this.translate.instant('OBJECT_TYPE.CUSTOM_TITLE'));
            this.objectTypeResourcesMap.set('Slug', this.translate.instant('OBJECT_TYPE.SLUG_TITLE'));
            this.objectTypeResourcesMap.set('Survey', this.translate.instant('OBJECT_TYPE.SURVEY_TITLE'));
        });
    }

    private loadNavigationToTypeOptions() {
        this.translate.get('NAVIGATION_TYPE.HOME').subscribe((res: any) => {
            this.navigationToTypeOptions = new Array<IPepOption>();
            this.navigationToTypeOptions.push({ key: 'Account Dashboard', value: this.translate.instant('NAVIGATION_TYPE.ACCOUNT_DASHBOARD') });
            this.navigationToTypeOptions.push({ key: 'Accounts', value: this.translate.instant('NAVIGATION_TYPE.ACCOUNTS') });
            this.navigationToTypeOptions.push({ key: 'Activities', value: this.translate.instant('NAVIGATION_TYPE.ACTIVITIES') });
            this.navigationToTypeOptions.push({ key: 'Activity', value: this.translate.instant('NAVIGATION_TYPE.ACTIVITY') });
            this.navigationToTypeOptions.push({ key: 'Back', value: this.translate.instant('NAVIGATION_TYPE.BACK') });
            this.navigationToTypeOptions.push({ key: 'Contacts', value: this.translate.instant('NAVIGATION_TYPE.CONTACTS') });
            this.navigationToTypeOptions.push({ key: 'Custom', value: this.translate.instant('NAVIGATION_TYPE.CUSTOM') });
            this.navigationToTypeOptions.push({ key: 'Home', value: this.translate.instant('NAVIGATION_TYPE.HOME') });
            this.navigationToTypeOptions.push({ key: 'Items', value: this.translate.instant('NAVIGATION_TYPE.ITEMS') });
            this.navigationToTypeOptions.push({ key: 'Slug', value: this.translate.instant('NAVIGATION_TYPE.SLUG') });
            this.navigationToTypeOptions.push({ key: 'Survey', value: this.translate.instant('NAVIGATION_TYPE.SURVEY') });
            this.navigationToTypeOptions.push({ key: 'Transaction', value: this.translate.instant('NAVIGATION_TYPE.TRANSACTION') });
            this.navigationToTypeOptions.push({ key: 'Users', value: this.translate.instant('NAVIGATION_TYPE.USERS') });
        });
    }

    private loadTransactionViewListOptions() {
        this.translate.get('TRANSACTION_TYPE.ORDER_CENTER').subscribe((res: any) => {
            this.transactionViewListOptions = new Array<IPepOption>();
            this.transactionViewListOptions.push({ key: 'Cart', value: this.translate.instant('TRANSACTION_TYPE.CART') });
            this.transactionViewListOptions.push({ key: 'Header', value: this.translate.instant('TRANSACTION_TYPE.HEADER') });
            this.transactionViewListOptions.push({ key: 'Item Details', value: this.translate.instant('TRANSACTION_TYPE.ITEM_DETAILS') });
            this.transactionViewListOptions.push({ key: 'Matrix', value: this.translate.instant('TRANSACTION_TYPE.MATRIX') });
            this.transactionViewListOptions.push({ key: 'Order Center', value: this.translate.instant('TRANSACTION_TYPE.ORDER_CENTER') });
        });
    }

    private loadOptions() {
        
        const optionsByTypeMap = new Map<string, IPepOption[]>();
        
        Object.keys(this._flowParameters).forEach(key => {
            const param: SchemeField = this._flowParameters[key];
            if (!optionsByTypeMap.has(param.Type)) {
                optionsByTypeMap.set(param.Type, []);
            }
            
            optionsByTypeMap.get(param.Type).push({
                key: key,
                value: key
            });
        });
        
        this.stringFlowParamsOptions = optionsByTypeMap.get('String');
        
        this.loadNavigationToTypeOptions();
        this.loadTransactionViewListOptions();

        this.logicBlockService.getSlugOptions().then((slugOptions: IPepOption[]) => {
            this.slugStaticOptions = slugOptions;
        });

        this.logicBlockService.getActivitiesListOptions().then((activitiesListOptions: IPepOption[]) => {
            this.activitiesListOptions = activitiesListOptions;
        });
    }

    private isStaticxNavigationType(type: NavigationType): boolean {
        return type === 'Home' || 
               type === 'Back' || 
               type === 'Accounts' || 
               type === 'Users' || 
               type === 'Contacts' || 
               type === 'Items';
    }

    private getSingleGenericField(field: string) {
        return {
            Title: this.translate.instant(`FIELDS_TITLE.${field.toUpperCase()}`) || field,
            Configuration: {
                Type: "TextBox",
                FieldID: field,
                Width: 10
            }
        };
    }

    private getSearchFields(fields: string[]): any[] {
        return fields.map(field => {
            return { FieldID: field }
        });
    }

    private getSmartSearchFields(fields: { id: string, title?: string, type?: SchemeFieldType }[]): any[] {
        return fields.map(field => {
            return { 
                FieldID: field.id,
                Title: field.title || this.translate.instant(`FIELDS_TITLE.${field.id.toUpperCase()}`),
                Type: field.type || 'String'
            }
        });
    }
    
    private loadAccountHostObject() {
        const listKey = `accounts_list`;
        this.translate.get('CHOOSE_ACCOUNT_TITLE').subscribe((title: any) => {
            this.accountsHostObject = {
                listContainer: {
                    List: {
                        Key: listKey, // `Notifications_List_${list.ListName}`
                        Name: title, // `list accounts`, // `list ${list.ListName}`,
                        Resource: 'accounts', // list.ResourceName,
                        Views: [{
                            Key: `accounts_list_view`, // `notifications_${list.ListName}_view`,
                            Type: "Grid",
                            Title: 'accounts',
                            Blocks: ['Name', 'ExternalID', 'City', 'ZipCode'].map(field => this.getSingleGenericField(field)),
                        }],
                        SelectionType: "Single", // Multi
                        Search: {
                            Fields: this.getSearchFields(['Name', 'ExternalID']),
                        },
                        ViewsMenu: {
                            Visible: false
                        },
                        SmartSearch: {
                            Fields: this.getSmartSearchFields([{ id: 'Name' }, {id: 'ExternalID'}]),
                        }
                    },
                    State: {
                        ListKey: listKey,
                    }
                },
                inDialog: true
            };
        });
    }

    protected isObjectNavigationType(type: NavigationType): boolean {
        return isObjectNavigationType(type);
    }

    protected calculateDoneIsDisabled() {
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

        this.doneIsDisabled = isDisabled;
    }

    ngOnInit(): void {
        this._flowParameters = this.hostObject?.EventData;
        this._currentConfiguration = this.hostObject?.Configuration;
        const defaultConfiguration = this.createDefaultConfiguration();

        if (!this._currentConfiguration || Object.keys(this._currentConfiguration).length === 0 || this._currentConfiguration.toString() === '{}') {
            this._currentConfiguration = defaultConfiguration;
        }
        
        this.loadResources();
        this.loadOptions();
        this.loadAccountHostObject();
        this.calculateDoneIsDisabled();
    }

    ngOnChanges(e: any): void {

    }

    onNavigationTypeChange(value: NavigationType) {
        if (this.isStaticxNavigationType(value)) {
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

        this.calculateDoneIsDisabled();
    }

    onFlowParamSourceChange(value: FlowParamSource, configurationProperty: NavigateToConifurationProperty) {
        if (!configurationProperty) {
            configurationProperty = {};
        }

        configurationProperty.FlowParamSource = value;
        configurationProperty.Value = null;
        this.calculateDoneIsDisabled();
    }

    onPropertyValueChange(value: string, configurationProperty: NavigateToConifurationProperty) {
        if (!configurationProperty) {
            configurationProperty = {};
        }

        configurationProperty.Value = value;
        this.calculateDoneIsDisabled();
    }

    onPropertyViewTypeChange(value: ActivitiesViewsType | TransactionViewsType, configurationProperty: NavigateToConifurationProperty, initValue = true) {
        if (this._currentConfiguration.Data.ViewType !== value) {
            this._currentConfiguration.Data.ViewType = value;
    
            if (initValue) {
                configurationProperty.Value = null;
            }
    
            this.calculateDoneIsDisabled();
        }
    }

    chooseAccountClick(value) {
        this.dialogRef = this.addonBlockService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'List',
            hostObject: this.accountsHostObject,
            hostEventsCallback: async ($event) => {
                if($event.action === 'on-done') {
                    this.onPropertyValueChange($event.data.selectedObjects[0], (this._currentConfiguration.Data as NavigateToObjectConifuration).ObjectData);
                    this.dialogRef.close();
                } else if($event.action === 'on-cancel') {
                    this.dialogRef.close();
                }
            }
        });
    }

    closeDialogClick(value) {
        this.hostEvents.emit({
            type: 'close-dialog'
        });
    }
    
    doneClick(value) {
        this.hostEvents.emit({
            type: 'set-configuration',
            configuration: this._currentConfiguration
        });
    }
}
