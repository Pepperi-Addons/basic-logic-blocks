import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { BaseLogicBlockService } from "src/app/shared/services/base-logic-blocks.service";

@Injectable()
export class CreateSurveyLogicBlockService extends BaseLogicBlockService {

    constructor(
        translate: TranslateService,
        sessionService: PepSessionService,
        httpService: PepHttpService
    ) {
        super(translate, sessionService, httpService);
    }    

    async getSurveyTemplateOptions(): Promise<IPepOption[]> {
        // TODO:
        const surveyTemplates = await this.papiClient.resources.resource('MySurveyTemplates').get();
        const options: IPepOption[] = surveyTemplates.map(template => ({ key: template.Key.toString(), value: template.Name }));
        return options;
    }
}