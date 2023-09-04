// import { FieldType, parse, JSONFilter, JSONRegularFilter } from '@pepperi-addons/pepperi-filters'
import { GetValueOption } from 'shared';

class GetValuesCpiService {

    private getParamValue(param: any, context: any): any {
        let paramValue = param?.Value || '';

        // If the param source is dynamic, we will get the param value from the context.
        if (param?.FlowParamSource === 'Dynamic') {
            paramValue = context[paramValue] || '';
        }

        return paramValue;
    }

    async getValues(body: any, context: any): Promise<GetValueOption[]> {
        let values: GetValueOption[] = [];
        
        // TODO: Fill the options.
        return values;
    }
}
export default GetValuesCpiService;
