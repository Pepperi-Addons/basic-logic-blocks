import { IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { FieldType, parse, toApiQueryString, filter, JSONFilter, JSONBaseFilter } from '@pepperi-addons/pepperi-filters'
import { GetValueOption, GetValuesConifuration, GetValuesMappedConifuration } from 'shared';
import BaseCpiService from './base-cpi.service';

class GetValuesCpiService extends BaseCpiService {

    private setDynamicValuesInFilter(jsonFilter: JSONFilter, context: any) {
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

    private async getValuesFromMappedData(mappedData: GetValuesMappedConifuration | undefined, context: any): Promise<GetValueOption[]> {
        let options: GetValueOption[] = [];

        if (mappedData && mappedData.Resource && mappedData.ResourceOptionKeyField && mappedData.ResourceOptionTitleField) {

            // If there is query need to build the filter, set the flow params values in the filter if needed.
            if (mappedData.ResourceQuery) {
                this.setDynamicValuesInFilter(mappedData.ResourceQuery, context);
            }

            const resource = await pepperi.resources.resource(mappedData.Resource).search({});
            const res = filter(resource.Objects, mappedData.ResourceQuery);

            if (res) {
                options = res.map(obj => {
                    return {
                        Key: mappedData?.ResourceOptionKeyField ? obj[mappedData.ResourceOptionKeyField] : '',
                        Title: mappedData?.ResourceOptionTitleField ? obj[mappedData.ResourceOptionTitleField] : ''
                    }
                }) || [];
            }
        }

        return options;
    }

    async getValues(body: any, context: any): Promise<GetValueOption[]> {
        const values: GetValueOption[] = [];

        if (context) {
            const client: IClient | undefined = context?.client || undefined;

            if (client) {
                const data: GetValuesConifuration = body || {};

                if (data.ValuesType === 'manual') {
                    values.push(...data.ManualOptions.map(option => { return { Key: option.key, Title: option.value } }));
                } else { // if (data.ValuesType === 'mapped')
                    values.push(...await this.getValuesFromMappedData(data.MappedData, context));
                }
            }
        }

        return values;
    }
}
export default GetValuesCpiService;
