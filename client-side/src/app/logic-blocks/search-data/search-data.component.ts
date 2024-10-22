import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { SearchDataLogicBlockService } from './search-data.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { IPepButtonClickEvent, PepButton } from '@pepperi-addons/ngx-lib/button';
import { IPepQueryBuilderField, PepQueryBuilderComponent } from '@pepperi-addons/ngx-lib/query-builder';
import { SearchDataConifuration, valuesType } from 'shared';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogActionsComponent } from 'src/app/shared/components/dialog-actions/dialog-actions.component';

@Component({
    templateUrl: './search-data.component.html',
    styleUrls: ['./search-data.component.scss'],
    providers: [SearchDataLogicBlockService]
})
export class SearchDataLogicBlockComponent implements OnInit {
    @ViewChild('resourceQueryBuilder', { static: true }) resourceQueryBuilder: PepQueryBuilderComponent;
    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
    @Input() hostObject: any;
    protected resourceOptions: IPepOption[] = [];
    protected resourceFieldsOptions: IPepOption[] = [];
    protected searchTypeOptions: IPepOption[] = [
        { key: 'single', value: 'Single Record by Key' },
        { key: 'multiple', value: 'Single or Multiple Records by Filter' }
    ];
    protected resourceFields: string = '';
    private _currentConfiguration: SearchDataConifuration;
    doneIsDisabled: boolean = true;
    title: string = 'SEARCH_DATA.TITLE';
    
    protected qbFields: Array<IPepQueryBuilderField>;
    protected qbVariableFields: Array<IPepQueryBuilderField>;
    protected qbResourceQuery: any;

    protected flowObjectTypeParams: Array<IPepOption> = [];
    
    private isValid = true;

    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: SearchDataLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService,
        public dialogRef: MatDialogRef<SearchDataLogicBlockComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
        ) {
            // this we are doing b'z this component may call from any other component
            this.hostObject =  this.hostObject? this.hostObject : data;
            if(this.hostObject?.isAddClicked){
                // if component loaded with Add button than init default configuration
                this.hostObject.Configuration = this.createDefaultConfiguration();
            }
    }

    ngOnInit(): void {
        this.logicBlockService.initFlowParameters(this.hostObject?.EventData);
        this.loadDataOnInit();
        this.validateData();
    }
    
    /**************************************************************************************/
    /*                            Resource functions.
    /**************************************************************************************/

    private loadResourceFieldsOptions() {
        this.resourceFieldsOptions = this.logicBlockService.getResourceFieldsOptions(this.currentConfiguration.Resource);
        this.logicBlockService.getResourceUDCByKey(this.currentConfiguration.Resource);
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
            this.validateData();
        }
    }

    protected validateData(): void {
        this.doneIsDisabled = this.calculateDoneIsDisabled();
    }

    onResourceFieldsChange(value: string) {
        this.resourceFields = value;
        this.currentConfiguration.ResourceFields = value.length > 0 ? value.split(';') : [];
        this.validateData();
    }

    onSearchTypeChange(value: string) {
        this.currentConfiguration.SearchType = value;
        this.validateData();
    }

    onResourceQueryChange(value: any) {
        this.currentConfiguration.ResourceQuery = value;
    }

    onResourceQueryValidationChanged(isValid: boolean) {
        this.isValid = isValid;
        this.validateData();
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
        this.validateData();
    }

    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/
    //

    /**************************************************************************************/
    /*                            Implements abstract functions.
    /**************************************************************************************/

    get currentConfiguration(): SearchDataConifuration {
        if(!this._currentConfiguration) {
            this._currentConfiguration = this.hostObject.Configuration;
        }
        return this._currentConfiguration as SearchDataConifuration ;
    }

    loadDataOnInit(): void {

        this.logicBlockService.getResourcesOptions().then(options => {
            this.resourceOptions = options;
            this.resourceFields = this.currentConfiguration.ResourceFields.join(';');
            this.loadResourceFieldsOptions();
            this.loadQueryBuilderData(true);
            this.flowObjectTypeParams = this.logicBlockService.flowParametersByType.get('Object');
        });
    }

    createDefaultConfiguration(): SearchDataConifuration {
        const config: SearchDataConifuration  = {
            Resource: '',
            ResourceFields: [],
            IsAsc: true,
            PageSize: 10,
            SaveResultIn: ''
        };
        return config;
    }
    
    calculateDoneIsDisabled(): boolean {
        return !this.currentConfiguration?.Resource || !(this.currentConfiguration?.ResourceFields?.length > 0) || !this.currentConfiguration?.SaveResultIn || !this.isValid;
    }

    onSave(){
        console.log('onsave function called', event);
        this.dialogRef.close(this.currentConfiguration);
    }

    onClose(){
        console.log('onClose function called', event);
        this.dialogRef.close();
    }
}
