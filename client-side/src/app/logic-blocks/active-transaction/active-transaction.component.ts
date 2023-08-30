import { TranslateService } from '@ngx-translate/core';
import { AddonDataScheme, SchemeField, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { ActiveTransactionLogicBlockService } from './active-transaction.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';

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
export class ActiveTransactionLogicBlockComponent implements OnInit {
    @Input() hostObject: { Configuration: ActiveTransactionConifuration, EventData: AddonDataScheme['Fields'] };

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    protected parameterTypeOptions: IPepOption[] = [{ key: 'Static', value: 'Static' }, { key: 'Dynamic', value: 'Dynamic' }];
    private _flowParameters: AddonDataScheme['Fields'];

    private _currentConfiguration: ActiveTransactionConifuration = null;
    get currentConfiguration(): ActiveTransactionConifuration {
        return this._currentConfiguration;
    }

    private dialogRef: any;
    private accountsHostObject: any;

    protected accountOptions: IPepOption[] = [];
    protected catalogOptions: IPepOption[] = [];
    protected catalogStaticOptions: IPepOption[] = [];
    protected transactionTypeOptions: IPepOption[] = [];
    protected transactionTypeStaticOptions: IPepOption[] = [];
    protected statusOptions: IPepOption[] = [];
    protected statusStaticOptions: IPepOption[] = [];
    
    protected doneIsDisabled = true;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private translate: TranslateService,
        private addonBlockService: PepAddonBlockLoaderService,
        private logicBlockService: ActiveTransactionLogicBlockService) {
    }

    private createDefaultConfiguration(): ActiveTransactionConifuration {
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

        this.accountOptions = optionsByTypeMap.get('String');
        this.catalogOptions = optionsByTypeMap.get('String');
        this.logicBlockService.getCatalogsOptions(this._currentConfiguration).then((catalogsOptions: IPepOption[]) => {
            this.catalogStaticOptions = catalogsOptions; 
        });

        this.transactionTypeOptions = optionsByTypeMap.get('String');
        this.logicBlockService.getTransactionTypeOptions().then((transactionTypeOptions: IPepOption[]) => {
            this.transactionTypeStaticOptions = transactionTypeOptions; 
        });

        this.statusOptions = optionsByTypeMap.get('String');
        this.logicBlockService.getStatusOptions().then((statusOptions: IPepOption[]) => {
            this.statusStaticOptions = statusOptions;
        });
    }

    protected calculateDoneIsDisabled() {
        this.doneIsDisabled = !this._currentConfiguration.Account.Value || !this._currentConfiguration.Status.Value;
    }

    private getSingleGenericField(field: string){
        return {
            Title: this.translate.instant(`FIELDS_TITLE.${field.toUpperCase()}`) || field,
            Configuration: {
                Type: "TextBox",
                FieldID: field,
                Width: 10
            }
        };
    }

    private getSearchFields(fields: string[]){
        return fields.map(field => {
            return { FieldID: field }
        })
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

    ngOnInit(): void {
        this._flowParameters = this.hostObject?.EventData;
        this._currentConfiguration = this.hostObject?.Configuration;
        const defaultConfiguration = this.createDefaultConfiguration();

        if (!this._currentConfiguration || Object.keys(this._currentConfiguration).length === 0 || this._currentConfiguration.toString() === '{}') {
            this._currentConfiguration = defaultConfiguration;
        }
        
        if (!this._currentConfiguration.Account) {
            this._currentConfiguration.Account = defaultConfiguration.Account;
        }
        if (!this._currentConfiguration.Catalog) {
            this._currentConfiguration.Catalog = defaultConfiguration.Catalog;
        }
        if (!this._currentConfiguration.TransactionType) {
            this._currentConfiguration.TransactionType = defaultConfiguration.TransactionType;
        }
        if (!this._currentConfiguration.Status) {
            this._currentConfiguration.Status = defaultConfiguration.Status;
        }

        this.loadOptions();
        this.loadAccountHostObject();
        this.calculateDoneIsDisabled();
    }

    ngOnChanges(e: any): void {

    }

    onFlowParamSourceChange(value: FlowParamSource, configurationProperty: ActiveTransactionConifurationProperty) {
        configurationProperty.FlowParamSource = value;
        configurationProperty.Value = null;
        this.calculateDoneIsDisabled();
    }

    onPropertyValueChange(value: string, configurationProperty: ActiveTransactionConifurationProperty) {
        configurationProperty.Value = value;
        this.calculateDoneIsDisabled();
    }

    // chooseAccountClick(event) {
    //     const accountsModalOptions: any = {
    //         addonBlockName: 'ResourcePicker',
    //         hostObject: {
    //             resource: 'accounts',
    //             view: '6283ea28-3ff2-4496-8fa3-2d8600eb725f', // TODO:
    //             selectionMode: 'single', // multi
    //             selectedObjectKeys: [],
    //         },
    //         title: 'Select account',
    //         allowCancel: true,
    //     };
    //     const accountsResult = { canceled: false, result: JSON.stringify({ selectedObjectKeys: ['6fc3dd58-6a17-4593-ab8a-fb7a7156eae6'] })};
    //     // const accountsResult = await client?.["showModal"](accountsModalOptions);
        
    //     // If account was choosen
    //     if (!accountsResult.canceled && accountsResult.result.length > 0) {
    //         const resObject = JSON.parse(accountsResult.result);
            
    //         if (resObject?.selectedObjectKeys.length > 0) {
    //             this._currentConfiguration.Account.Value = resObject.selectedObjectKeys[0];
    //         }
    //     }

    //     this.calculateDoneIsDisabled();
    // }

    chooseAccountClick(value) {
        this.dialogRef = this.addonBlockService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'List',
            hostObject: this.accountsHostObject,
            hostEventsCallback: async ($event) => {
                if($event.action === 'on-done') {
                    this._currentConfiguration.Account.Value = $event.data.selectedObjects[0];
                    this.calculateDoneIsDisabled();
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
