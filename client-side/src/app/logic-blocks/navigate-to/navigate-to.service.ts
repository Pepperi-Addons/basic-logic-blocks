import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { PapiClient } from "@pepperi-addons/papi-sdk";
import jwt from 'jwt-decode';
import { config } from "../../app.config";

@Injectable()
export class NavigateToLogicBlockService {
    private addonUUID: string;
    private papiBaseURL: string;
    private parsedToken: any;

    constructor(
        private translate: TranslateService,
        private sessionService: PepSessionService,
        private httpService: PepHttpService
    ) {
        this.addonUUID = config.AddonUUID;
        const accessToken = this.sessionService.getIdpToken();
        this.parsedToken = jwt(accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseurl"];

    }    

    get papiClient(): PapiClient {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: this.sessionService.getIdpToken(),
            addonUUID: this.addonUUID,
            suppressLogging:true
        })
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