import { IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { FieldType, parse, toApiQueryString, filter, JSONFilter, JSONRegularFilter } from '@pepperi-addons/pepperi-filters'
import { GetValueOption, GetValuesConifuration, GetValuesMappedConifuration } from 'shared';

class GetValuesCpiService {

    private getParamValue(param: any, context: any): any {
        let paramValue = param?.Value || '';

        // If the param source is dynamic, we will get the param value from the context.
        if (param?.FlowParamSource === 'Dynamic') {
            paramValue = context[paramValue] || '';
        }

        return paramValue;
    }

    private getValue(object: any, apiName: string): any {
        if (!apiName) {
            return undefined;
        }

        if (typeof object !== 'object') {
            return undefined;
        }

        // support regular APINames & dot anotation
        if (apiName in object) {
            return object[apiName];
        }

        // support nested object & arrays
        apiName = apiName.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        const arr = apiName.split('.');
        return this.getValue(object[arr[0]], arr.slice(1).join('.'));
    }

    private async getValuesFromMappedData(mappedData: GetValuesMappedConifuration | undefined): Promise<GetValueOption[]> {
        let options: GetValueOption[] = [];

        if (mappedData && mappedData.Resource && mappedData.ResourceOptionKeyField && mappedData.ResourceOptionTitleField) {
            let qsFilter = '';

            // If there is query need to build the filter
            if (mappedData.ResourceQuery) {
                // TODO: parse the filter and set the flow params values if needed.
                const resourceQuery: JSONFilter = mappedData.ResourceQuery;

                qsFilter = toApiQueryString(resourceQuery) || '';
                // const a = toNgxFilter(resourceQuery);
            }

            const resource = await pepperi.resources.resource(mappedData.Resource).search({
                // Where: qsFilter,
                // Fields: [mappedData.ResourceOptionKeyField, mappedData.ResourceOptionTitleField],
            });
            debugger;
                
            const res = filter(resource.Objects, mappedData.ResourceQuery, this.getValue);

            if (res) {

                debugger;
            }
            options = resource?.Objects.map(obj => {
                return {
                    Key: mappedData?.ResourceOptionKeyField ? obj[mappedData.ResourceOptionKeyField] : '',
                    Title: mappedData?.ResourceOptionTitleField ? obj[mappedData.ResourceOptionTitleField] : ''
                }
            }) || [];
        }

        return options;
    }

    async getValues(body: any, context: any): Promise<GetValueOption[]> {
        const values: GetValueOption[] = [];

        if (context) {
            const client: IClient | undefined = context?.client || undefined;

            if (client) {
                // debugger;
                const data: GetValuesConifuration = body || {};

                if (data.ValuesType === 'manual') {
                    values.push(...data.ManualOptions.map(option => { return { Key: option.key, Title: option.value } }));
                } else { // if (data.ValuesType === 'mapped')
                    values.push(...await this.getValuesFromMappedData(data.MappedData));
                }
            }
        }

        return values;
    }
}
export default GetValuesCpiService;
