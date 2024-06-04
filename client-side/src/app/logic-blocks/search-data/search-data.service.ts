import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { AddonData } from "@pepperi-addons/papi-sdk";
import { BaseLogicBlockService } from "src/app/shared/services/base-logic-blocks.service";

@Injectable()
export class SearchDataLogicBlockService extends BaseLogicBlockService {
    
    private _resourcesMap: Map<string, AddonData> = new Map<string, AddonData>();
    get resourcesMap(): ReadonlyMap<string, AddonData> {
        return this._resourcesMap;
    }

    constructor(
        translate: TranslateService,
        sessionService: PepSessionService,
        httpService: PepHttpService
    ) {
        super(translate, sessionService, httpService);
    }    

    async getResourcesOptions(): Promise<IPepOption[]> {
        const resources = await this.papiClient.resources.resource('resources').get();

        this._resourcesMap = new Map<string, AddonData>(resources.map(resource => [resource.Name, resource]));
        
        const options: IPepOption[] = resources.map(resource => ({ key: resource.Name, value: resource.Name }));
        return options;
    }

    getResourceFieldsOptions(resourceName: string): IPepOption[] {
        let options: IPepOption[] = [];
        const resource = this._resourcesMap.get(resourceName);
        
        if (resource) {
            options = Object.keys(resource.Fields).map(fieldKey => ({ key: fieldKey, value: fieldKey }));
        }

        return options;
    }

}