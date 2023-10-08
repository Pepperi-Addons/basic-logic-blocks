
class CreateTransactionCpiService {

    private getParamValue(param: any, context: any): any {
        let paramValue = param?.Value || '';

        // If the param source is dynamic, we will get the param value from the context.
        if (param?.FlowParamSource === 'Dynamic') {
            paramValue = context[paramValue] || '';
        }

        return paramValue;
    }

    async createTransactionUUID(body: any, context: any) {
        let transactionUUID = '';

        const accountUUID = this.getParamValue(body.Account, context);
        const catalogValue = this.getParamValue(body.Catalog, context);
        const trasactionTypeValue = this.getParamValue(body.TransactionType, context);

        // Only if account and catalog and ATD are selected, we will create the transaction, Else we will return empty string.
        if (accountUUID.length > 0 && catalogValue.length > 0 && trasactionTypeValue.length > 0) {
            const accountStr = accountUUID.replace(/-/g, '');

            const res = await pepperi.app.transactions.add({
                type: {
                    Name: trasactionTypeValue,
                },
                references: {
                    account: {
                        UUID: accountStr,
                    },
                    catalog: {
                        Name: catalogValue,
                    },
                },
            });

            transactionUUID = res.status === 'added' ? (res.id || '') : '';
        }

        return transactionUUID;
    }
}
export default CreateTransactionCpiService;
