import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

import { MatRadioModule } from '@angular/material/radio';

import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';
import { OpenExternalLogicBlockComponent } from './open-external.component';

import { config } from '../../app.config';

@NgModule({
    declarations: [OpenExternalLogicBlockComponent],
    imports: [
        CommonModule,
        MatRadioModule,
        PepButtonModule,
        PepTextboxModule,
        PepSelectModule,
        PepRemoteLoaderModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        })
    ],
    exports: [OpenExternalLogicBlockComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class OpenExternalLogicBlockModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
