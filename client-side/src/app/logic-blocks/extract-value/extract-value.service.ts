import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { ExtractValueConifuration } from "./extract-value.component"; 
import { BaseLogicBlockService } from "src/app/shared/services/base-logic-blocks.service";
import * as jsonPath from 'jsonpath';


@Injectable()
export class ExtractValueLogicBlockService extends BaseLogicBlockService {

    constructor(
        translate: TranslateService,
        sessionService: PepSessionService,
        httpService: PepHttpService
    ) {
        super(translate, sessionService, httpService);
    }   
    
    // extractFromtArray(query: string,data: any[]) {
    //     const extractedValue = jsonPath.query(data,``)
    // }
    
}