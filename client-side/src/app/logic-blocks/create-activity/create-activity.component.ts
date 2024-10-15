import { TranslateService } from '@ngx-translate/core';
import { SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { CreateActivityLogicBlockService } from './create-activity.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { ConifurationProperty } from 'shared';

export interface CreateActivityConifuration {
    Account: CreateActivityConifurationProperty;
    ActivityType: CreateActivityConifurationProperty;
    SaveResultIn?: string;
}

export interface CreateActivityConifurationProperty extends ConifurationProperty {
    Type: SchemeFieldType;
}

@Component({
    templateUrl: './create-activity.component.html',
    styleUrls: ['./create-activity.component.scss'],
    providers: [CreateActivityLogicBlockService]
})
export class CreateActivityLogicBlockComponent extends BaseLogicBlockDirective {
    protected accountOptions: IPepOption[] = [];
    protected activityTypeOptions: IPepOption[] = [];
    protected activityTypeStaticOptions: IPepOption[] = [];
    protected flowObjectTypeParams: Array<IPepOption> = [];
    
    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: CreateActivityLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService,
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    private loadOptions() {
        const stringFlowParamsOptions = this.logicBlockService.getFlowParametersOptions('String');

        this.flowObjectTypeParams = stringFlowParamsOptions;
        this.accountOptions = stringFlowParamsOptions;
        this.activityTypeOptions = stringFlowParamsOptions;
        this.logicBlockService.getActivityTypeOptions().then((activityTypeOptions: IPepOption[]) => {
            this.activityTypeStaticOptions = activityTypeOptions; 
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

    get currentConfiguration(): CreateActivityConifuration {
        return this._currentConfiguration as CreateActivityConifuration;
    }

    protected getTitleResourceKey(): string {
        return 'CREATE_ACTIVITY.TITLE';
    }

    protected loadDataOnInit(): void {
        const defaultConfiguration = this.createDefaultConfiguration();
        if (!this.currentConfiguration.Account) {
            this.currentConfiguration.Account = defaultConfiguration.Account;
        }
        if (!this.currentConfiguration.ActivityType) {
            this.currentConfiguration.ActivityType = defaultConfiguration.ActivityType;
        }

        this.loadOptions();
    }

    protected createDefaultConfiguration(): CreateActivityConifuration {
        const config: CreateActivityConifuration = {
            Account: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            },
            ActivityType: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: null
            }
        };

        return config;
    }
    
    protected calculateDoneIsDisabled(): boolean {
        return !this.currentConfiguration.Account.Value || !this.currentConfiguration.ActivityType.Value || !this.currentConfiguration.SaveResultIn;
    }

    onSaveResultInChange(value: string) {
        this.currentConfiguration.SaveResultIn = value;
        super.validateData();
    }
}
