import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { ActiveTransactionLogicBlockComponent } from './active-transaction.component';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';

import { config } from '../../app.config';

@NgModule({
    declarations: [ActiveTransactionLogicBlockComponent],
    imports: [
        CommonModule,
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
    exports: [ActiveTransactionLogicBlockComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class ActiveTransactionLogicBlockModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
