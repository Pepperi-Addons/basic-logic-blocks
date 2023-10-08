
class CreateActivityCpiService {

    private getParamValue(param: any, context: any): any {
        let paramValue = param?.Value || '';

        // If the param source is dynamic, we will get the param value from the context.
        if (param?.FlowParamSource === 'Dynamic') {
            paramValue = context[paramValue] || '';
        }

        return paramValue;
    }

    async createActivityUUID(body: any, context: any) {
        let activityUUID = '';

        const accountUUID = this.getParamValue(body.Account, context);
        const activityTypeValue = this.getParamValue(body.ActivityType, context);

        // Only if account and ATD are selected, we will create the activity, Else we will return empty string.
        if (accountUUID.length > 0 && activityTypeValue.length > 0) {
            const accountStr = accountUUID.replace(/-/g, '');

            const res = await pepperi.app.activities.add({
                type: {
                    Name: activityTypeValue,
                },
                references: {
                    account: {
                        UUID: accountStr,
                    }
                },
            });

            activityUUID = res.status === 'added' ? (res.id || '') : '';
        }

        return activityUUID;
    }
}
export default CreateActivityCpiService;
