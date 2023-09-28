import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { GetValuesLogicBlockComponent } from './get-values.component';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';

import { config } from '../../app.config';
import { PepQueryBuilderModule } from '@pepperi-addons/ngx-lib/query-builder';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepNgxCompositeLibModule } from '@pepperi-addons/ngx-composite-lib';
import { PepGroupButtonsSettingsModule } from '@pepperi-addons/ngx-composite-lib/group-buttons-settings';
// import { LogicBlockComponent } from 'src/app/shared/components/logic-block/logic-block.component';

import {
    PepIconModule,
    PepIconRegistry,
    pepIconSystemBin,
} from '@pepperi-addons/ngx-lib/icon';

const pepIcons = [
    pepIconSystemBin
];
@NgModule({
    declarations: [
        
        // LogicBlockComponent,
        GetValuesLogicBlockComponent
    ],
    imports: [
        CommonModule,
        DragDropModule,
        PepButtonModule,
        PepTextboxModule,
        PepSelectModule,
        PepIconModule,
        PepRemoteLoaderModule,
        PepTopBarModule,
        PepQueryBuilderModule,
        PepNgxCompositeLibModule,
        PepGroupButtonsSettingsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        })
    ],
    exports: [GetValuesLogicBlockComponent],
    providers: [
        TranslateStore,
        // Add here all used services.
    ]
})
export class GetValuesLogicBlockModule {
    constructor(
        translate: TranslateService,
        private pepIconRegistry: PepIconRegistry,
        private pepAddonService: PepAddonService

    ) {
        this.pepIconRegistry.registerIcons(pepIcons);
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
