import { FieldType, parse, toApiQueryString, filter, JSONFilter, JSONBaseFilter } from '@pepperi-addons/pepperi-filters'
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

    protected setDynamicValuesInFilter(jsonFilter: JSONFilter, context: any) {
        if (jsonFilter.Operation === 'AND' || jsonFilter.Operation === 'OR') {
            this.setDynamicValuesInFilter(jsonFilter.LeftNode, context);
            this.setDynamicValuesInFilter(jsonFilter.RightNode, context);
        } else {
            // If the value type is dynamic, we will override the value from the context.
            if (jsonFilter['ValueType'] === 'Dynamic' && (jsonFilter as JSONBaseFilter).Values?.length > 0) {
                const paramValue = (jsonFilter as JSONBaseFilter).Values[0];
                (jsonFilter as JSONBaseFilter).Values[0] = context[paramValue] || '';
            }
        }
    }
}
export default BaseCpiService;
