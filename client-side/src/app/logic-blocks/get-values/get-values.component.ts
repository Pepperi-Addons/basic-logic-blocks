import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { GetValuesLogicBlockService } from './get-values.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { IPepButtonClickEvent, PepButton } from '@pepperi-addons/ngx-lib/button';

export type valuesType = 'manual' | 'mapped';
export interface GetValuesConifuration {
    ValuesType: valuesType;
    ManualOptions: IPepOption[];
    MappedData?: GetValuesMappedConifuration;
}

export interface GetValuesMappedConifuration {
    Resource?: string;
    ResourceOptionKeyField?: string;
    ResourceOptionTitleField?: string;
    ResourceQuery?: any;
}

@Component({
    templateUrl: './get-values.component.html',
    styleUrls: ['./get-values.component.scss'],
    providers: [GetValuesLogicBlockService]
})
export class GetValuesLogicBlockComponent extends BaseLogicBlockDirective {
    protected readonly MANUAL_KEY = 'manual';
    protected readonly MAPPED_KEY = 'mapped';

    protected valuesTypesButtons: Array<PepButton>;

    protected resourceOptions: IPepOption[] = [];
    protected resourceFieldsOptions: IPepOption[] = [];

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

    onMappedResourceChange(value: string) {
        if (!this.currentConfiguration.MappedData) {
            this.currentConfiguration.MappedData = {};
        }

        if (this.currentConfiguration.MappedData.Resource !== value) {

            this.currentConfiguration.MappedData.Resource = value;
            this.currentConfiguration.MappedData.ResourceOptionKeyField = '';
            this.currentConfiguration.MappedData.ResourceOptionTitleField = '';

            // load the resource fields options.
            this.loadResourceFieldsOptions();
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
        let isDisabled = false;

        return isDisabled;
    }
}
