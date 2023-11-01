import { FieldType, parse, JSONFilter, JSONRegularFilter } from '@pepperi-addons/pepperi-filters'
import BaseCpiService from './base-cpi.service';

class ActiveTransactionCpiService extends BaseCpiService {

    private getAccountUUID(account: any, context: any): string {
        const accountValue = this.getParamValue(account, context);
        return accountValue;
    }

    private getStatusFilterValue(status: any, context: any): string {
        const statusValue = this.getParamValue(status, context);

        let statusFilterValue = '';
        const statusArr = statusValue.split(';');
        for (let index = 0; index < statusArr.length; index++) {
            statusFilterValue += `${statusArr[index]}`;
            if ((index + 1) < statusArr.length) {
                statusFilterValue += ',';
            }
        }

        return statusFilterValue;
    }

    private getCatalogFilterValue(catalog: any, context: any): string {
        let catalogFilterValue = '';
        const catalogValue = this.getParamValue(catalog, context);

        if (catalogValue !== '') {
            catalogFilterValue = `AND CatalogExternalID='${catalogValue}'`;
        }

        return catalogFilterValue;
    }

    private getTransactionTypeFilterValue(transactionType: any, context: any): string {
        let transactionTypeFilterValue = '';
        const trasactionTypeValue = this.getParamValue(transactionType, context);

        if (trasactionTypeValue !== '') {
            transactionTypeFilterValue = `AND Type='${trasactionTypeValue}'`;
        }

        return transactionTypeFilterValue;
    }

    async getActiveTransactionUUID(body: any, context: any) {
        let transactionUUID = '';
        const user = await pepperi.environment.user();
        const accountUUID = this.getAccountUUID(body.Account, context);
        const statusFilterValue = this.getStatusFilterValue(body.Status, context);

        // Only if account and status are selected, we will search for the transaction, Else we will return empty string.
        if (user && accountUUID.length > 0 && statusFilterValue.length > 0) {
            const catalogFilterValue = this.getCatalogFilterValue(body.Catalog, context);
            const transactionTypeFilterValue = this.getTransactionTypeFilterValue(body.TransactionType, context);
            const accountStr = accountUUID.replace(/-/g, '');
            const whereString = `Creator.UUID='${user.uuid}' AND AccountUUID='${accountStr}' AND Status IN(${statusFilterValue}) ${transactionTypeFilterValue} ${catalogFilterValue}`;

            // Convert the where string to filter object.
            const fields: {[key: string]: FieldType} = { 'Creator.UUID': 'String', 'AccountUUID': 'String', 'Status': 'Integer' };
            if (transactionTypeFilterValue.length > 0) {
                fields['Type'] = 'String';
            }
            if (catalogFilterValue.length > 0) {
                fields['CatalogExternalID'] = 'String';
            }
            const filterObj = parse(whereString, fields);

            const transactions = await pepperi.api.transactions.search({
                fields: ['UUID', 'AccountUUID', 'CatalogExternalID', 'Type', 'CreationDateTime', 'Status', 'StatusName', 'Creator.UUID'],
                filter: filterObj,
                sorting: [{ Field: 'CreationDateTime', Ascending: false }],
            });

            transactionUUID = transactions?.objects[0]?.UUID || '';
        }

        return transactionUUID;
    }
}
export default ActiveTransactionCpiService;
