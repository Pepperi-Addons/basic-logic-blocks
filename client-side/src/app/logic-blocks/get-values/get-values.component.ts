import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { GetValuesLogicBlockService } from './get-values.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { IPepButtonClickEvent, PepButton } from '@pepperi-addons/ngx-lib/button';
import { IPepQueryBuilderField, PepQueryBuilderComponent } from '@pepperi-addons/ngx-lib/query-builder';
import { GetValuesConifuration, valuesType } from 'shared';

@Component({
    templateUrl: './get-values.component.html',
    styleUrls: ['./get-values.component.scss'],
    providers: [GetValuesLogicBlockService]
})
export class GetValuesLogicBlockComponent extends BaseLogicBlockDirective {
    @ViewChild('resourceQueryBuilder', { static: true }) resourceQueryBuilder: PepQueryBuilderComponent;

    protected readonly MANUAL_KEY = 'manual';
    protected readonly MAPPED_KEY = 'mapped';

    protected valuesTypesButtons: Array<PepButton>;

    protected resourceOptions: IPepOption[] = [];
    protected resourceFieldsOptions: IPepOption[] = [];

    protected qbFields: Array<IPepQueryBuilderField>;
    protected qbVariableFields: Array<IPepQueryBuilderField>;
    protected qbResourceQuery: any;

    private isValid = true;

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
    
    onValuesTypeChange(buttonKey: valuesType) {
        this.currentConfiguration.ValuesType = buttonKey;
    }


    /**************************************************************************************/
    /*                            Manual options functions.
    /**************************************************************************************/

    onDragStart(event: CdkDragStart) {
        this.logicBlockService.changeCursorOnDragStart();
    }

    onDragEnd(event: CdkDragEnd) {
        this.logicBlockService.changeCursorOnDragEnd();
    }
    
    onDropManualOption(event: CdkDragDrop<any>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }
    }

    onAddManualOption(event: IPepButtonClickEvent) {
        this.currentConfiguration.ManualOptions.push({key: '', value: ''});
    }

    onManualOptionKeyChange(value: string, option: IPepOption) {
        option.key = value;
    }

    onManualOptionTitleChange(value: string, option: IPepOption) {
        option.value = value;
    }

    onDeleteManualOption(event: IPepButtonClickEvent, option: IPepOption) {
        const optionIndex = this.currentConfiguration.ManualOptions.findIndex(o => o.key === option.key && o.value === option.value);
        if (optionIndex > -1) {
            this.currentConfiguration.ManualOptions.splice(optionIndex, 1);
        }
    }

    /**************************************************************************************/
    /*                            Mapped options functions.
    /**************************************************************************************/

    private loadResourceFieldsOptions() {
        this.resourceFieldsOptions = this.logicBlockService.getResourceFieldsOptions(this.currentConfiguration.MappedData.Resource);
    }

    private loadFilterFieldsByResource() {
        const resource = this.logicBlockService.resourcesMap.get(this.currentConfiguration.MappedData.Resource);
        const fields: IPepQueryBuilderField[] = []
        
        Object.keys(resource.Fields).forEach(fieldKey => {
            const field = resource.Fields[fieldKey];
            fields.push({
                FieldID: fieldKey,
                Title: fieldKey,
                FieldType: field.Type
            });
        });

        this.qbFields = fields;
    }

    private loadFlowVariableFields() {
        const flowParametersByType = this.logicBlockService.flowParametersByType;
        const fields: IPepQueryBuilderField[] = []
        
        Array.from(flowParametersByType.keys()).forEach(fieldType => {
            const fieldsByType = flowParametersByType.get(fieldType).map(field => { return { FieldID: field.key, Title: field.value, FieldType: fieldType }})
            fields.push(...fieldsByType);
        });
        
        this.qbVariableFields = fields;
    }
    
    private loadQueryBuilderData(isFirstTime: boolean = false) {
        if (this.currentConfiguration.MappedData?.Resource) {
            this.qbResourceQuery = JSON.parse(JSON.stringify(this.currentConfiguration.MappedData.ResourceQuery || {}));
            this.loadFilterFieldsByResource();
            
            if (isFirstTime) {
                this.loadFlowVariableFields();
            }
        }
    }

    onMappedResourceChange(value: string) {
        if (!this.currentConfiguration.MappedData) {
            this.currentConfiguration.MappedData = {};
        }

        if (this.currentConfiguration.MappedData.Resource !== value) {
            this.currentConfiguration.MappedData.Resource = value;
            this.currentConfiguration.MappedData.ResourceOptionKeyField = '';
            this.currentConfiguration.MappedData.ResourceOptionTitleField = '';

            // Load the resource fields options.
            this.loadResourceFieldsOptions();

            // Load the query builder data.
            // this.resourceQueryBuilder.reset();
            this.currentConfiguration.MappedData.ResourceQuery = {};
            this.loadQueryBuilderData();
        }
    }

    onMappedResourceKeyChange(value: string) {
        this.currentConfiguration.MappedData.ResourceOptionKeyField = value;
    }

    onMappedResourceTitleChange(value: string) {
        this.currentConfiguration.MappedData.ResourceOptionTitleField = value;
    }

    onMappedResourceQueryChange(value: any) {
        this.currentConfiguration.MappedData.ResourceQuery = value;
    }

    onMappedResourceQueryValidationChanged(isValid: boolean) {
        this.isValid = isValid;
    }

    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/
    //

    /**************************************************************************************/
    /*                            Implements abstract functions.
    /**************************************************************************************/

    get currentConfiguration(): GetValuesConifuration {
        return this._currentConfiguration;
    }

    protected getTitleResourceKey(): string {
        return 'GET_VALUES.TITLE';
    }

    protected loadDataOnInit(): void {
        this.translate.get('GET_VALUES.MANUAL_OPTIONS.TITLE').subscribe((res: string) => {
            this.valuesTypesButtons = [{ 
                key: this.MANUAL_KEY,
                value: this.translate.instant('GET_VALUES.MANUAL_OPTIONS.TITLE')
            }, { 
                key: this.MAPPED_KEY,
                value: this.translate.instant('GET_VALUES.MAPPED_OPTIONS.TITLE')
            }];
        });

        this.logicBlockService.getResourcesOptions().then(options => {
            this.resourceOptions = options;

            this.loadResourceFieldsOptions();
            this.loadQueryBuilderData(true);
        });
    }

    protected createDefaultConfiguration(): GetValuesConifuration {
        const config: GetValuesConifuration = {
            ValuesType: this.MANUAL_KEY,
            ManualOptions: [],
        };
        return config;
    }
    
    protected calculateDoneIsDisabled(): boolean {
        return !this.isValid;
    }
}
