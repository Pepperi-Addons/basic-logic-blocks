import { IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { FieldType, parse, toApiQueryString, JSONFilter, JSONRegularFilter } from '@pepperi-addons/pepperi-filters'
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

    private async getValuesFromMappedData(mappedData: GetValuesMappedConifuration): Promise<GetValueOption[]> {
        let options: GetValueOption[] = [];

        if (mappedData && mappedData.Resource && mappedData.ResourceOptionKeyField && mappedData.ResourceOptionTitleField) {
            let qsFilter = '';

            // If there is query need to build the filter
            if (mappedData.ResourceQuery) {
                // TODO: parse the filter and set the flow params values if needed.
                const resourceQuery: JSONFilter = mappedData.ResourceQuery;

                qsFilter = toApiQueryString(resourceQuery) || '';
            }

            const resource = await pepperi.resources.resource(mappedData.Resource).search({
                Where: qsFilter,
                Fields: [mappedData.ResourceOptionKeyField, mappedData.ResourceOptionTitleField],
            });

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
                const data: GetValuesConifuration = body.Data || {};

                if (data.ValuesType === 'manual') {
                    values.push(...data.ManualOptions.map(option => { return { Key: option.key, Title: option.value } }));
                } else { // if (data.ValuesType === 'mapped')
                    if (data.MappedData && data.MappedData.Resource && data.MappedData.ResourceOptionKeyField && data.MappedData.ResourceOptionTitleField) {
                        values.push(...await this.getValuesFromMappedData(data.MappedData));
                    }
                }
            }
        }

        return values;
    }
}
export default GetValuesCpiService;
