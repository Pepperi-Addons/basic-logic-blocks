
class CreateSurveyCpiService {

    private getParamValue(param: any, context: any): any {
        let paramValue = param?.Value || '';

        // If the param source is dynamic, we will get the param value from the context.
        if (param?.FlowParamSource === 'Dynamic') {
            paramValue = context[paramValue] || '';
        }

        return paramValue;
    }

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
