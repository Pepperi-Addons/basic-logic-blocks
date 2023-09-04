import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { AddonDataScheme, PapiClient, SchemeField, SchemeFieldType } from "@pepperi-addons/papi-sdk";
import jwt from 'jwt-decode';
import { config } from "../../app.config";

@Injectable()
export abstract class BaseLogicBlockService {
    protected addonUUID: string;
    private papiBaseURL: string;
    private parsedToken: any;

    private _flowParameters: AddonDataScheme['Fields'];
    private _flowParametersByType: Map<SchemeFieldType, IPepOption[]> = new Map<SchemeFieldType, IPepOption[]>();

    constructor(
        protected translate: TranslateService,
        protected sessionService: PepSessionService,
        protected httpService: PepHttpService
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

    initFlowParameters(flowParameters: AddonDataScheme['Fields']) {
        this._flowParameters = flowParameters;

        Object.keys(this._flowParameters).forEach(key => {
            const param: SchemeField = this._flowParameters[key];
            if (!this._flowParametersByType.has(param.Type)) {
                this._flowParametersByType.set(param.Type, []);
            }
            
            this._flowParametersByType.get(param.Type).push({
                key: key,
                value: key
            });
        });
    }

    getFlowParametersOptions(type: SchemeFieldType): IPepOption[] {
        return this._flowParametersByType.get(type) || [];
    }
}