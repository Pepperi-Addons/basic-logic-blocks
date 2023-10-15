import { TranslateService } from '@ngx-translate/core';
import { SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { CreateSurveyLogicBlockService } from './create-survey.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { FlowParamSource } from 'shared';

export interface CreateSurveyConifuration {
    Account: CreateSurveyConifurationProperty;
    SurveyTemplate: CreateSurveyConifurationProperty;
    // Resource: CreateSurveyConifurationProperty; // TODO: add this if neccessary (default is MySurveys).
}

export interface CreateSurveyConifurationProperty {
    FlowParamSource: FlowParamSource;
    Type: SchemeFieldType;
    Value: any;
}

@Component({
    templateUrl: './create-survey.component.html',
    styleUrls: ['./create-survey.component.scss'],
    providers: [CreateSurveyLogicBlockService]
})
export class CreateSurveyLogicBlockComponent extends BaseLogicBlockDirective {
    protected accountOptions: IPepOption[] = [];
    protected surveyTemplateOptions: IPepOption[] = [];
    protected surveyTemplateStaticOptions: IPepOption[] = [];
    
    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: CreateSurveyLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService,
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    private loadOptions() {
        const stringFlowParamsOptions = this.logicBlockService.getFlowParametersOptions('String');

        this.accountOptions = stringFlowParamsOptions;
        
        this.surveyTemplateOptions = stringFlowParamsOptions;
        this.logicBlockService.getSurveyTemplateOptions().then((surveyTemplateOptions: IPepOption[]) => {
            this.surveyTemplateStaticOptions = surveyTemplateOptions; 
        });

    }

    // Do nothing here the init implementation is in the loadDataOnInit function.
    // ngOnInit(): void { }

    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/

    protected onAccountChoose(accountUUID: string) {
        this.onPropertyValueChange(accountUUID, this.currentConfiguration.Account);
    }

    /**************************************************************************************/
    /*                            Implements abstract functions.
    /**************************************************************************************/

    get currentConfiguration(): CreateSurveyConifuration {
        return this._currentConfiguration as CreateSurveyConifuration;
    }

    protected getTitleResourceKey(): string {
        return 'CREATE_SURVEY.TITLE';
    }

    protected loadDataOnInit(): void {
        const defaultConfiguration = this.createDefaultConfiguration();
        if (!this.currentConfiguration.Account) {
            this.currentConfiguration.Account = defaultConfiguration.Account;
        }
        if (!this.currentConfiguration.SurveyTemplate) {
            this.currentConfiguration.SurveyTemplate = defaultConfiguration.SurveyTemplate;
        }

        this.loadOptions();
    }

    protected createDefaultConfiguration(): CreateSurveyConifuration {
        const config: CreateSurveyConifuration = {
            Account: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            },
            SurveyTemplate: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            }
        };

        return config;
    }
    
    protected calculateDoneIsDisabled(): boolean {
        return !this.currentConfiguration.Account.Value || !this.currentConfiguration.SurveyTemplate.Value;
    }
     
}
