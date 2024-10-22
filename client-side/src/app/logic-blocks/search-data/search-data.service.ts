import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { AddonData } from "@pepperi-addons/papi-sdk";
import { BaseLogicBlockService } from "src/app/shared/services/base-logic-blocks.service";

interface SearchData<T> {
    Objects: T[];
    Count?: number;
}

@Injectable()
export class SearchDataLogicBlockService extends BaseLogicBlockService {
    
    private _resourcesMap: Map<string, AddonData> = new Map<string, AddonData>();
    private _resourcesDocumentsMap: Map<string, any> = new Map<string, any>();

    get resourcesMap(): ReadonlyMap<string, AddonData> {
        return this._resourcesMap;
    }

    get resourcesDocumentMap(): ReadonlyMap<string, AddonData> {
        return this._resourcesDocumentsMap;
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
    
    async getResourceUDCByKey(resourceName: string): Promise<any> {
        // Fetch all resources for the given resourceName
        const resources: SearchData<AddonData> = await this.papiClient.resources.resource(resourceName).search({});
    
        // If no resources are found or Objects is empty, return an empty Map
        if (!resources || !resources.Objects || resources.Objects.length === 0) {
            return new Map();
        }
        this._resourcesDocumentsMap = new Map<string, any>(resources.Objects.map(resource => [resource?.Key, resource]));
        
        console.log('Total resorces are here ', this.resourcesDocumentMap);
       
        return this.resourcesDocumentMap;
    }
}
