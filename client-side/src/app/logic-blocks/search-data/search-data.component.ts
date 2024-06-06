import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { SearchDataLogicBlockService } from './search-data.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { IPepButtonClickEvent, PepButton } from '@pepperi-addons/ngx-lib/button';
import { IPepQueryBuilderField, PepQueryBuilderComponent } from '@pepperi-addons/ngx-lib/query-builder';
import { SearchDataConifuration, valuesType } from 'shared';
import { coerceNumberProperty } from '@angular/cdk/coercion';

@Component({
    templateUrl: './search-data.component.html',
    styleUrls: ['./search-data.component.scss'],
    providers: [SearchDataLogicBlockService]
})
export class SearchDataLogicBlockComponent extends BaseLogicBlockDirective {
    @ViewChild('resourceQueryBuilder', { static: true }) resourceQueryBuilder: PepQueryBuilderComponent;

    protected resourceOptions: IPepOption[] = [];
    protected resourceFieldsOptions: IPepOption[] = [];
    protected resourceFields: string = '';
    
    protected qbFields: Array<IPepQueryBuilderField>;
    protected qbVariableFields: Array<IPepQueryBuilderField>;
    protected qbResourceQuery: any;

    protected flowObjectTypeParams: Array<IPepOption> = [];
    
    private isValid = true;

    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: SearchDataLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    // Do nothing here the init implementation is in the loadDataOnInit function.
    // ngOnInit(): void { }
    
    /**************************************************************************************/
    /*                            Resource functions.
    /**************************************************************************************/

    private loadResourceFieldsOptions() {
        this.resourceFieldsOptions = this.logicBlockService.getResourceFieldsOptions(this.currentConfiguration.Resource);
    }

    private loadFilterFieldsByResource() {
        const resource = this.logicBlockService.resourcesMap.get(this.currentConfiguration.Resource);
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
        if (this.currentConfiguration.Resource) {
            this.qbResourceQuery = JSON.parse(JSON.stringify(this.currentConfiguration.ResourceQuery || {}));
            this.loadFilterFieldsByResource();
            
            if (isFirstTime) {
                this.loadFlowVariableFields();
            }
        }
    }

    onResourceChange(value: string) {
        if (this.currentConfiguration.Resource !== value) {
            this.currentConfiguration.Resource = value;
            this.currentConfiguration.ResourceFields = [];
            this.resourceFields = '';
            this.currentConfiguration.SortBy = '';

            // Load the resource fields options.
            this.loadResourceFieldsOptions();

            // Load the query builder data.
            // this.resourceQueryBuilder.reset();
            this.currentConfiguration.ResourceQuery = {};
            this.loadQueryBuilderData();
            super.validateData();
        }
    }

    onResourceFieldsChange(value: string) {
        this.resourceFields = value;
        this.currentConfiguration.ResourceFields = value.length > 0 ? value.split(';') : [];
        super.validateData();
    }

    onResourceQueryChange(value: any) {
        this.currentConfiguration.ResourceQuery = value;
    }

    onResourceQueryValidationChanged(isValid: boolean) {
        this.isValid = isValid;
        super.validateData();
    }

    onSortByChange(value: string) {
        this.currentConfiguration.SortBy = value;
    }

    onIsAscChanged(value: boolean) {
        this.currentConfiguration.IsAsc = value;
    }

    onPageSizeChange(value: string) {
        const numberValue = coerceNumberProperty(value, 10);
        this.currentConfiguration.PageSize = numberValue;
    }

    onSaveResultInChange(value: string) {
        this.currentConfiguration.SaveResultIn = value;
        super.validateData();
    }

    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/
    //

    /**************************************************************************************/
    /*                            Implements abstract functions.
    /**************************************************************************************/

    get currentConfiguration(): SearchDataConifuration {
        return this._currentConfiguration;
    }

    protected getTitleResourceKey(): string {
        return 'SEARCH_DATA.TITLE';
    }

    protected loadDataOnInit(): void {
        
        this.logicBlockService.getResourcesOptions().then(options => {
            this.resourceOptions = options;
            this.resourceFields = this.currentConfiguration.ResourceFields.join(';');
            this.loadResourceFieldsOptions();
            this.loadQueryBuilderData(true);
            this.flowObjectTypeParams = this.logicBlockService.flowParametersByType.get('Object');
        });
    }

    protected createDefaultConfiguration(): SearchDataConifuration {
        const config: SearchDataConifuration = {
            Resource: '',
            ResourceFields: [],
            IsAsc: true,
            PageSize: 10,
            SaveResultIn: ''
        };
        return config;
    }
    
    protected calculateDoneIsDisabled(): boolean {
        return !this.currentConfiguration.Resource || !(this.currentConfiguration.ResourceFields?.length > 0) || !this.currentConfiguration.SaveResultIn || !this.isValid;
    }
}
