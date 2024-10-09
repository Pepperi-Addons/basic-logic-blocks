import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { SearchDataMultipleResourcesLogicBlockComponent } from './search-data-multiple-resources.component';
import { PepSizeDetectorModule } from '@pepperi-addons/ngx-lib/size-detector';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import {
  PepIconRegistry,
  pepIconSystemBin,
} from '@pepperi-addons/ngx-lib/icon';
import { config } from '../../../app.config';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';

const pepIcons = [
  pepIconSystemBin
];

@NgModule({
  declarations: [
    SearchDataMultipleResourcesLogicBlockComponent
  ],
  imports: [
      CommonModule,
      PepSizeDetectorModule,
        PepTopBarModule,
        PepPageLayoutModule,
        PepGenericListModule,
        PepButtonModule,
      TranslateModule.forChild({
          loader: {
              provide: TranslateLoader,
              useFactory: (addonService: PepAddonService) => 
                  PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
              deps: [PepAddonService]
          }, isolate: false
      })
  ],
  exports: [SearchDataMultipleResourcesLogicBlockComponent],
  providers: [
      TranslateStore,
      // Add here all used services.
  ]
})
export class SearchDataMultipleResourcesModule {

  constructor(
    translate: TranslateService,
    private pepIconRegistry: PepIconRegistry,
    private pepAddonService: PepAddonService

) {
    this.pepIconRegistry.registerIcons(pepIcons);
    this.pepAddonService.setDefaultTranslateLang(translate);
}

}
