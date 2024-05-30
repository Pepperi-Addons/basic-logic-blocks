import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { BaseLogicBlockService } from "src/app/shared/services/base-logic-blocks.service";

@Injectable()
export class CreateEditRichTextService extends BaseLogicBlockService {

    constructor(
        translate: TranslateService,
        sessionService: PepSessionService,
        httpService: PepHttpService
    ) {
        super(translate, sessionService, httpService);
    }    

    async getActivityTypeOptions(): Promise<IPepOption[]> {
        //const activityTypes = await this.papiClient.metaData.type('activities').types.get();
        //const options: IPepOption[] = activityTypes.map(activityType => ({ key: activityType.ExternalID.toString(), value: activityType.ExternalID }));

        // TODO - remove this line and add the real implementation.
        return [];
    }
}