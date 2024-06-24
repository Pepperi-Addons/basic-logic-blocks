import { IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { filter, toApiQueryString } from '@pepperi-addons/pepperi-filters'
import { GetValueOption, SearchDataConifuration } from 'shared';
import BaseCpiService from './base-cpi.service';

class SearchDataCpiService extends BaseCpiService {

    private async getSearchData(configuration: SearchDataConifuration | undefined, context: any): Promise<any> {
        let searchData: any;

        if (configuration && configuration.Resource) {
            let where: any = undefined;

            // If there is query need to build the filter, set the flow params values in the filter if needed.
            if (configuration.ResourceQuery) {
                this.setDynamicValuesInFilter(configuration.ResourceQuery, context);
                where = toApiQueryString(configuration.ResourceQuery);
            }

            searchData = await pepperi.resources.resource(configuration.Resource).search({
                Where: where,
                Fields: configuration.ResourceFields,
                PageSize: configuration.PageSize,
                OrderBy: `${configuration.SortBy} ${configuration.IsAsc ? 'asc' : 'desc'}`,
                IncludeCount: true,
            });

            // searchData.Objects = filter(searchData.Objects, configuration.ResourceQuery);
            // searchData.Count = searchData.Objects.length;
        }

        return searchData;
    }

    async searchData(body: any, context: any): Promise<any> {
        let result: any;

        if (context) {
            const client: IClient | undefined = context?.client || undefined;

            if (client) {
                const data: SearchDataConifuration = body || {};
                result = await this.getSearchData(data, context);
            }
        }

        return result;
    }
}
export default SearchDataCpiService;
