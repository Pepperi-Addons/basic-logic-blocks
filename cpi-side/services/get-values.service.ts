import { IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { FieldType, parse, toApiQueryString, filter, JSONFilter, JSONBaseFilter } from '@pepperi-addons/pepperi-filters'
import { GetValueOption, GetValuesConifuration, GetValuesMappedConifuration } from 'shared';
import BaseCpiService from './base-cpi.service';

class GetValuesCpiService extends BaseCpiService {

    private async getValuesFromMappedData(mappedData: GetValuesMappedConifuration | undefined, context: any): Promise<GetValueOption[]> {
        let options: GetValueOption[] = [];

        if (mappedData && mappedData.Resource && mappedData.ResourceOptionKeyField && mappedData.ResourceOptionTitleField) {
            let where: any = undefined;

            // If there is query need to build the filter, set the flow params values in the filter if needed.
            if (mappedData.ResourceQuery) {
                this.setDynamicValuesInFilter(mappedData.ResourceQuery, context);
                where = toApiQueryString(mappedData.ResourceQuery);
            }

            const key = mappedData?.ResourceOptionKeyField || '';
            const title = mappedData?.ResourceOptionTitleField || '';

            const resource = await pepperi.resources.resource(mappedData.Resource).search({
                Where: where,
                Fields: [key, title],
                OrderBy: `${title} asc`
            });

            // const res = filter(resource.Objects, mappedData.ResourceQuery);

            if (resource) {
                options = resource.Objects.map(obj => {
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
