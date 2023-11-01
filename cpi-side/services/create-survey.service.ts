import BaseCpiService from "./base-cpi.service";

class CreateSurveyCpiService extends BaseCpiService {

    async createSurveyUUID(body: any, context: any) {
        let surveyUUID = '';

        const accountUUID = this.getParamValue(body.Account, context);
        const surveyTemplateKey = this.getParamValue(body.SurveyTemplate, context);
        const resourceName = this.getParamValue(body.Resource, context) || 'MySurveys';

        // Only if account and ATD are selected, we will create the activity, Else we will return empty string.
        if (accountUUID.length > 0 && surveyTemplateKey.length > 0) {
            const accountStr = accountUUID.replace(/-/g, '');

            const newSurvey = {
                'Template': surveyTemplateKey,
                'Account': accountStr,
                'StatusName': 'InCreation'
            };
            console.log(newSurvey);
            const res = await pepperi.resources.resource(resourceName).post(newSurvey);
            console.log(res);
            surveyUUID = res.Key || '';
        }

        return surveyUUID;
    }
}
export default CreateSurveyCpiService;
