// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

// import { PepAddonService } from '@pepperi-addons/ngx-lib';
// import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
// import { DialogActionsComponent } from './dialog-actions.component';

// import { config } from '../../../app.config';

// @NgModule({
//     declarations: [DialogActionsComponent],
//     imports: [
//         CommonModule,
//         PepButtonModule,
//         TranslateModule.forChild({
//             loader: {
//                 provide: TranslateLoader,
//                 useFactory: (addonService: PepAddonService) => 
//                     PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
//                 deps: [PepAddonService]
//             }, isolate: false
//         })
//     ],
//     exports: [DialogActionsComponent],
//     providers: [
//         TranslateStore,
//         // Add here all used services.
//     ]
// })
// export class DialogActionsModule {
//     constructor(
//         translate: TranslateService,
//         private pepAddonService: PepAddonService
//     ) {
//         this.pepAddonService.setDefaultTranslateLang(translate);
//     }
// }
