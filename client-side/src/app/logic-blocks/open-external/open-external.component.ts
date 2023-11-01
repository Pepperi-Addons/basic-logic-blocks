import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { IPepOption } from '@pepperi-addons/ngx-lib';
import { OpenExternalLogicBlockService } from './open-external.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';
import { OpenExternalConifuration, UrlType } from 'shared';

@Component({
    templateUrl: './open-external.component.html',
    styleUrls: ['./open-external.component.scss'],
    providers: [OpenExternalLogicBlockService]
})
export class OpenExternalLogicBlockComponent extends BaseLogicBlockDirective {
    protected urlOptions: IPepOption[] = [];
    
    constructor(
        viewContainerRef: ViewContainerRef,
        translate: TranslateService,
        protected logicBlockService: OpenExternalLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService,
        ) {
            super(viewContainerRef, translate, logicBlockService);
    }

    private loadOptions() {
        const stringFlowParamsOptions = this.logicBlockService.getFlowParametersOptions('String');

        this.urlOptions = stringFlowParamsOptions;
    }

    // Do nothing here the init implementation is in the loadDataOnInit function.
    // ngOnInit(): void { }


    onUrlTypeChange(value: UrlType) {
        this._currentConfiguration.Type = value;
    }

    /**************************************************************************************/
    /*                            Override base functions.
    /**************************************************************************************/


    /**************************************************************************************/
    /*                            Implements abstract functions.
    /**************************************************************************************/

    get currentConfiguration(): OpenExternalConifuration {
        return this._currentConfiguration as OpenExternalConifuration;
    }

    protected getTitleResourceKey(): string {
        return 'OPEN_EXTERNAL.TITLE';
    }

    protected loadDataOnInit(): void {
        const defaultConfiguration = this.createDefaultConfiguration();
        if (!this.currentConfiguration.URL) {
            this.currentConfiguration.URL = defaultConfiguration.URL;
        }
        if (!this.currentConfiguration.Type) {
            this.currentConfiguration.Type = defaultConfiguration.Type;
        }

        this.loadOptions();
    }

    protected createDefaultConfiguration(): OpenExternalConifuration {
        const config: OpenExternalConifuration = {
            URL: {
                FlowParamSource: 'Static',
                Value: null
            },
            Type: 'external-app',
        };

        return config;
    }
    
    protected calculateDoneIsDisabled(): boolean {
        return !this.currentConfiguration.URL.Value;
    }
     
}
