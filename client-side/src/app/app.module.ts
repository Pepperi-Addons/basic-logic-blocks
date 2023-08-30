import { DoBootstrap, Injector, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';

import { SettingsComponent, SettingsModule } from './settings';

import { NavigateToLogicBlockComponent, NavigateToLogicBlockModule } from './logic-blocks/navigate-to';
import { ActiveTransactionLogicBlockComponent, ActiveTransactionLogicBlockModule } from './logic-blocks/active-transaction';

import { config } from './app.config';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SettingsModule,
        NavigateToLogicBlockModule,
        ActiveTransactionLogicBlockModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }
        }),
        AppRoutingModule,
    ],
    providers: [],
    bootstrap: [
        // AppComponent
    ]
})
export class AppModule implements DoBootstrap {
    constructor(
        private injector: Injector,
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }

    ngDoBootstrap() {
        // There is no settings component in this addon, so we don't need to define it.
        // this.pepAddonService.defineCustomElement(`settings-element-${config.AddonUUID}`, SettingsComponent, this.injector);

        // Define the logic blocks components.
        this.pepAddonService.defineCustomElement(`active-transaction-logic-block-element-${config.AddonUUID}`, ActiveTransactionLogicBlockComponent, this.injector);
        this.pepAddonService.defineCustomElement(`navigate-to-logic-block-element-${config.AddonUUID}`, NavigateToLogicBlockComponent, this.injector);
        
    }
}

