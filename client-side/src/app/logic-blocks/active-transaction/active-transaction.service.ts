import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IPepOption, PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { PapiClient } from "@pepperi-addons/papi-sdk";
import jwt from 'jwt-decode';
import { ActiveTransactionConifuration } from "./active-transaction.component";
import { config } from "../../app.config";

@Injectable()
export class ActiveTransactionLogicBlockService {
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

    async getCatalogsOptions(currentConfiguration: ActiveTransactionConifuration): Promise<IPepOption[]> {
        const catalogs = await this.papiClient.catalogs.find({ fields: ['ExternalID'] });
        const options: IPepOption[] = catalogs.map(catalog => ({ key: catalog.ExternalID.toString(), value: catalog.ExternalID }));
        return options;
    }

    async getTransactionTypeOptions(): Promise<IPepOption[]> {
        const transactionTypes = await this.papiClient.metaData.type('transactions').types.get();
        const options: IPepOption[] = transactionTypes.map(transactionType => ({ key: transactionType.ExternalID.toString(), value: transactionType.ExternalID }));
        return options;
    }

    async getStatusOptions(): Promise<IPepOption[]> {
        const options: IPepOption[] = [
            { key: '1', value: 'In creation' },
            { key: '2', value: 'Submitted' },
            { key: '3', value: 'In Progress' },
            { key: '4', value: 'On Hold' },
            { key: '5', value: 'Cancelled' },
            { key: '6', value: 'Need Revision' },
            { key: '7', value: 'Closed' },
            { key: '8', value: 'Failed' },
            { key: '9', value: 'Need Approval' },
            { key: '12', value: 'ERP' },
            { key: '14', value: 'Invoice' },
            { key: '15', value: 'Need Online Approval' },
            { key: '16', value: 'In Planning' },
            { key: '17', value: 'Published' },
            { key: '18', value: 'In Payment' },
            { key: '19', value: 'Paid' },
            { key: '20', value: 'Need Payment' },
        ];

        return options;
    }
}