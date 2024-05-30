import { TranslateService } from '@ngx-translate/core';
import { SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { CreateEditRichTextService } from './edit-rich-text.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { ConifurationProperty } from 'shared';

export interface EditRichTextConfiguration {
    Account: EditRichTextConfigurationProperty;
    ActivityType: EditRichTextConfigurationProperty;
}

export interface EditRichTextConfigurationProperty extends ConifurationProperty {
    Type: SchemeFieldType;
}

@Component({
    templateUrl: './edit-rich-text.component.html',
    styleUrls: ['./edit-rich-text.component.scss'],
    providers: [CreateEditRichTextService]
})
export class EditRichTextLogicBlockComponent extends BaseLogicBlockDirective {
    protected accountOptions: IPepOption[] = [];
    
    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: CreateEditRichTextService,
        public addonBlockService: PepAddonBlockLoaderService,
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    private loadOptions() {
        const stringFlowParamsOptions = this.logicBlockService.getFlowParametersOptions('String');
        this.accountOptions = stringFlowParamsOptions;
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

    get currentConfiguration(): EditRichTextConfiguration {
        return this._currentConfiguration as EditRichTextConfiguration;
    }

    protected getTitleResourceKey(): string {
        return 'EDIT_RICH_TEXT.TITLE';
    }

    protected loadDataOnInit(): void {
        // const defaultConfiguration = this.createDefaultConfiguration();
        // if (!this.currentConfiguration.Account) {
        //     this.currentConfiguration.Account = defaultConfiguration.Account;
        // }
        // if (!this.currentConfiguration.ActivityType) {
        //     this.currentConfiguration.ActivityType = defaultConfiguration.ActivityType;
        // }

        // this.loadOptions();
    }

    protected createDefaultConfiguration(): EditRichTextConfiguration {
        const config: EditRichTextConfiguration = {
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
        // TODO - Implement the logic here.
        return true;
    }
     
}
