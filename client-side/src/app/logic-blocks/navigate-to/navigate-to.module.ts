import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

import { MatRadioModule } from '@angular/material/radio';

import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';
import { NavigateToLogicBlockComponent } from './navigate-to.component';

// import { DialogActionsModule } from 'src/app/shared/components/dialog-actions/dialog-actions.module';

import { config } from '../../app.config';

@NgModule({
    declarations: [NavigateToLogicBlockComponent],
    imports: [
        CommonModule,
        MatRadioModule,
        PepButtonModule,
        PepTextboxModule,
        PepSelectModule,
        PepRemoteLoaderModule,
        // DialogActionsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        })
    ],
    exports: [NavigateToLogicBlockComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class NavigateToLogicBlockModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
