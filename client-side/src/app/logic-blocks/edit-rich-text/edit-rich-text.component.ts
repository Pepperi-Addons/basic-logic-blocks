import { TranslateService } from '@ngx-translate/core';
import { SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { CreateEditRichTextService } from './edit-rich-text.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { ConifurationProperty } from 'shared';

export interface EditRichTextConfiguration {
    Object: EditRichTextConfigurationProperty;
    Find: EditRichTextConfigurationProperty;
    Replace: EditRichTextConfigurationProperty;
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
    protected objectFlowParamsOptions: IPepOption[] = [];
    protected stringFlowParamsOptions: IPepOption[] = [];
    
    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: CreateEditRichTextService,
        public addonBlockService: PepAddonBlockLoaderService,
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    private loadOptions() {
        this.stringFlowParamsOptions = this.logicBlockService.getFlowParametersOptions('String');
        this.objectFlowParamsOptions = this.logicBlockService.getFlowParametersOptions('Object');
        //this.accountOptions = stringFlowParamsOptions;
    }

    // Do nothing here the init implementation is in the loadDataOnInit function.
    // ngOnInit(): void { }

    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/

  

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

         this.loadOptions();
    }

    protected createDefaultConfiguration(): EditRichTextConfiguration {
        const config: EditRichTextConfiguration = {
            Object: {
                Type: 'Object',
                Value: ''
            },
            Find: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: ''
            },
            Replace: {
                FlowParamSource: 'Static',
                Type: 'String',
                Value: ''
            }
        };

        return config;
    }
    
    protected calculateDoneIsDisabled(): boolean {
        // TODO - Implement the logic here.
        return false;
    }
     
}
