import { ConifurationProperty } from "shared";

class BaseCpiService {

    protected getParamValue(param: ConifurationProperty, context: any): any {
        let paramValue = param?.Value || '';

        // If the param source is dynamic, we will get the param value from the context.
        if (param?.FlowParamSource === 'Dynamic') {
            paramValue = context[paramValue] || '';
        }

        return paramValue;
    }
}
export default BaseCpiService;
