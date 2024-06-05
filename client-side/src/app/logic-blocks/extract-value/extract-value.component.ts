import { TranslateService } from '@ngx-translate/core';
import { SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { ExtractValueLogicBlockService } from './extract-value.service'; 
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { ConifurationProperty } from 'shared';


export interface ExtractValueConifuration {
    Object: ExtractValueConifurationProperty;
    SourcePathState: ExtractValueConifurationProperty;
    SourcePath: ExtractValueConifurationProperty;
    SaveSourceOn: ExtractValueConifurationProperty;
    Value: ExtractValueConifurationProperty;
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
    protected objectFlowParamsOptions: IPepOption[] = [];
    protected allFlowParamsOptions: IPepOption[] = [];
    isDynamicPath = false;
    
    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: ExtractValueLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService,
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    private loadOptions() {
        this.objectFlowParamsOptions = this.logicBlockService.getFlowParametersOptions('Object');
        this.allFlowParamsOptions = this.loadFlowVariableFields();

        console.log(this.objectFlowParamsOptions);
        console.log(this.allFlowParamsOptions );
    }


    private loadFlowVariableFields() {
        const flowParametersByType = this.logicBlockService.flowParametersByType;
        const fields: IPepOption[] = [];
        
        Array.from(flowParametersByType.keys()).forEach(fieldType => {
            console.log(fieldType);
            const fieldsByType = flowParametersByType.get(fieldType).map(field => { return { key: field.key, value: field.value }});
            fields.push(...fieldsByType);
        });
        
        return fields;
    }

    // Do nothing here the init implementation is in the loadDataOnInit function.
    // ngOnInit(): void { }

    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/



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
        this.createDefaultConfiguration();
        this.loadOptions();
    }

    protected createDefaultConfiguration(): ExtractValueConifuration {
        const config: ExtractValueConifuration = {
            Object: {
                FlowParamSource: 'Static',
                Type: 'Object',
                Value: null
            },
            SourcePath: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            },
            Value: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            },
            SaveSourceOn: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            },
            SourcePathState: {
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
