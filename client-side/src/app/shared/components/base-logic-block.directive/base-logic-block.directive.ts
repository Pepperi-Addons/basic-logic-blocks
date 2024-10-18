import { AfterViewInit, ComponentRef, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild, ViewContainerRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption } from "@pepperi-addons/ngx-lib";
import { PepAddonBlockLoaderService } from "@pepperi-addons/ngx-lib/remote-loader";
import { AddonDataScheme, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Subject, takeUntil } from "rxjs";
import { FlowParamSource } from "shared";
import { BaseLogicBlockService } from "../../services/base-logic-blocks.service";
import { DialogHeaderComponent } from "../dialog-header/dialog-header.component";
import { DialogActionsComponent } from "../dialog-actions/dialog-actions.component";

@Directive({})
export abstract class BaseLogicBlockDirective implements OnInit, OnDestroy {
    @ViewChild('logicBlockHeader', { read: ViewContainerRef, static: true }) logicBlockHeader: ViewContainerRef;
    @Input() hostObject: { Configuration: any, EventData: AddonDataScheme['Fields'] };

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    
    private readonly _destroyed: Subject<void>;
    private headerContainerRef: ComponentRef<DialogHeaderComponent>;
    private actionsContainerRef: ComponentRef<DialogActionsComponent>;
    private doneIsDisabled = true;
    private abiDialogRef: any;

    protected parameterTypeOptions: IPepOption[] = [{ key: 'Static', value: 'Static' }, { key: 'Dynamic', value: 'Dynamic' }];
    protected accountsHostObject: any;
    protected _currentConfiguration: any = null;
    
    constructor(
        protected viewContainerRef: ViewContainerRef,
        protected translate: TranslateService,
        protected logicBlockService: BaseLogicBlockService
    ) {
        this._destroyed = new Subject();
    }

    private createHeaderComponent() {
        this.headerContainerRef = this.logicBlockHeader.createComponent(DialogHeaderComponent);
        this.headerContainerRef.location.nativeElement
        this.headerContainerRef.instance.titleResourceKey = this.getTitleResourceKey();
        this.logicBlockHeader.insert(this.headerContainerRef.hostView, 0);
    }

    private createActionsComponent() {
        this.actionsContainerRef = this.viewContainerRef.createComponent(DialogActionsComponent);
        this.actionsContainerRef.instance.doneIsDisabled = this.doneIsDisabled;
        this.actionsContainerRef.instance.currentConfiguration = this._currentConfiguration;
        this.actionsContainerRef.instance.hostEvents.subscribe((event) =>{
            return this.hostEvents.emit(event);
        } );
        this.viewContainerRef.insert(this.actionsContainerRef.hostView);
    }

    private getSingleGenericField(field: string) {
        return {
            Title: this.translate.instant(`COMMON.FIELDS_TITLE.${field.toUpperCase()}`) || field,
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
                Title: field.title || this.translate.instant(`COMMON.FIELDS_TITLE.${field.id.toUpperCase()}`),
                Type: field.type || 'String'
            }
        });
    }
    
    protected validateData(): void {
        this.doneIsDisabled = this.calculateDoneIsDisabled();

        // Update the actions component
        this.actionsContainerRef.instance.doneIsDisabled = this.doneIsDisabled;
    }

    protected getDestroyer() {
        return takeUntil(this._destroyed);
    }

    protected loadAccountHostObject() {
        const listKey = `accounts_list`;
        this.translate.get('NAVIGATE_TO.CHOOSE_ACCOUNT_TITLE').subscribe((title: any) => {
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

    protected onFlowParamSourceChange(value: FlowParamSource, configurationProperty: any) {
        if (!configurationProperty) {
            configurationProperty = {};
        }

        configurationProperty.FlowParamSource = value;
        configurationProperty.Value = null;
        this.validateData();
    }

    protected onPropertyValueChange(value: string, configurationProperty: any) {
        if (!configurationProperty) {
            configurationProperty = {};
        }

        configurationProperty.Value = value;
        this.validateData();
    }

    protected chooseAccountClick(addonBlockService: PepAddonBlockLoaderService) {
        this.abiDialogRef = addonBlockService.loadAddonBlockInDialog({
            container: this.viewContainerRef,
            name: 'List',
            hostObject: this.accountsHostObject,
            hostEventsCallback: async ($event) => {
                if($event.action === 'on-done') {
                    this.onAccountChoose($event.data.selectedObjects[0]);
                    this.abiDialogRef.close();
                } else if($event.action === 'on-cancel') {
                    this.abiDialogRef.close();
                }
            }
        });
    }

    protected onAccountChoose(accountUUID: string) {
        // Not implemented in the base, need to override in the child.
    }

    ngOnInit(): void {
        this.logicBlockService.initFlowParameters(this.hostObject?.EventData);
        // @Input() hostObject is passed from flow addon
        this._currentConfiguration = JSON.parse(JSON.stringify(this.hostObject?.Configuration));
        const defaultConfiguration = this.createDefaultConfiguration();
        if (!this._currentConfiguration || Object.keys(this._currentConfiguration).length === 0 || this._currentConfiguration.toString() === '{}') {
            this._currentConfiguration = defaultConfiguration;
        }

        this.loadDataOnInit();

        this.loadAccountHostObject();
        this.createHeaderComponent();
        this.createActionsComponent();
        this.validateData();
    }
    
    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }
    
    onCloseDialogClick() {
        this.hostEvents.emit({
            type: 'close-dialog'
        });
        // 
        // this.hostEvents.emit({
        //     type: 'afterClosed'
        // });
    }
    
    onDoneClick() {
        this.hostEvents.emit({
            type: 'set-configuration',
            configuration: this.currentConfiguration
        });
    }

    abstract get currentConfiguration(): any;
    protected abstract getTitleResourceKey(): string;
    protected abstract loadDataOnInit(): void;
    protected abstract calculateDoneIsDisabled(): boolean;
    protected abstract createDefaultConfiguration(): any;
}