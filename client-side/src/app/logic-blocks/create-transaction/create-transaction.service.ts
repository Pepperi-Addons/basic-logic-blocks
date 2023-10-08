import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { CreateTransactionConifuration } from "./create-transaction.component";
import { BaseLogicBlockService } from "src/app/shared/services/base-logic-blocks.service";

@Injectable()
export class CreateTransactionLogicBlockService extends BaseLogicBlockService {

    constructor(
        translate: TranslateService,
        sessionService: PepSessionService,
        httpService: PepHttpService
    ) {
        super(translate, sessionService, httpService);
    }    


    async getCatalogsOptions(currentConfiguration: CreateTransactionConifuration): Promise<IPepOption[]> {
        const catalogs = await this.papiClient.catalogs.find({ fields: ['ExternalID'] });
        const options: IPepOption[] = catalogs.map(catalog => ({ key: catalog.ExternalID.toString(), value: catalog.ExternalID }));
        return options;
    }

    async getTransactionTypeOptions(): Promise<IPepOption[]> {
        const transactionTypes = await this.papiClient.metaData.type('transactions').types.get();
        const options: IPepOption[] = transactionTypes.map(transactionType => ({ key: transactionType.ExternalID.toString(), value: transactionType.ExternalID }));
        return options;
    }
}