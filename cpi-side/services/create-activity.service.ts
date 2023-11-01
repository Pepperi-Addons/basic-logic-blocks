import BaseCpiService from "./base-cpi.service";

class CreateActivityCpiService extends BaseCpiService {

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
