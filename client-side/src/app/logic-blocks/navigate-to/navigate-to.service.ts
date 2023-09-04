import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { BaseLogicBlockService } from "src/app/shared/services/base-logic-blocks.service";

@Injectable()
export class NavigateToLogicBlockService extends BaseLogicBlockService {
    
    constructor(
        translate: TranslateService,
        sessionService: PepSessionService,
        httpService: PepHttpService
    ) {
        super(translate, sessionService, httpService);
    }    

    async getSlugOptions(): Promise<IPepOption[]> {
        const slugsDataViews = JSON.parse(sessionStorage.getItem('slugsDataViews')) || null;
        const options: IPepOption[] = slugsDataViews?.Fields?.map(field => ({ key: field.FieldID, value: field.FieldID }));
        return options;
    }

    async getActivitiesListOptions(): Promise<IPepOption[]> {
        const listViews = await this.papiClient.get('/meta_data/all_activities/data_views');
        const options: IPepOption[] = listViews.map(lv => ({ key: lv.ID.toString(), value: lv.Name }));
        return options;
    }

}