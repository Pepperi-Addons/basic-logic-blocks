import { IClient, IContext } from '@pepperi-addons/cpi-node/build/cpi-side/events';
import { NavigationType, ActivitiesViewsType, TransactionViewsType, NavigateToConfiguration, BaseNavigateToConifuration,
    isObjectNavigationType,
    NavigateToObjectConifuration,
    NavigateToActivitiesConifuration,
    NavigateToTransactionConifuration} from 'shared';

class NavigateToCpiService {

    private getParamValue(param: any, context: any): any {
        let paramValue = param?.Value || '';

        // If the param source is dynamic, we will get the param value from the context.
        if (param?.FlowParamSource === 'Dynamic') {
            paramValue = context[paramValue] || '';
        }

        return paramValue;
    }

    private async navigateToActivitiesUrl(data: BaseNavigateToConifuration, context: any, client: IClient) {
        const value = this.getParamValue((data as NavigateToActivitiesConifuration).ActivitiesData, context);
        const viewType: ActivitiesViewsType = data.ViewType || '';

        if (viewType === 'All Lists' || (viewType === 'Single List' && value)) {
            const listID = viewType === 'Single List' ? `?listID=GL_${value}` : '';
            await client.navigateTo({ url: `list/all_activities${listID}`, history: 'ClearTo' });
        }
    }

    private async navigateToTransactionUrl(data: BaseNavigateToConifuration, context: any, client: IClient) {
        const transactionValue = this.getParamValue((data as NavigateToTransactionConifuration).TransactionData, context);

        if (transactionValue) {
            const viewType: TransactionViewsType = data.ViewType || '';

            // Split the value of the qs param to get the qs value without the ? (if exist in the qs).
            const qsValueArr = this.getParamValue((data as NavigateToTransactionConifuration).QsTransactionData, context).toString().split('?');
            const qsValue = qsValueArr[qsValueArr.length - 1].length > 0 ? `?${qsValueArr[qsValueArr.length - 1]}` : '';
            const childValue = this.getParamValue((data as NavigateToTransactionConifuration).ChildTransactionData, context);

            if (viewType === 'Order Center') {
                await client.navigateTo({ url: `transactions/scope_items/${transactionValue}${qsValue}` });
            } else if (viewType === 'Cart') {
                await client.navigateTo({ url: `transactions/cart/${transactionValue}${qsValue}` });
            } else if (viewType === 'Header') {
                await client.navigateTo({ url: `transactions/details/${transactionValue}${qsValue}` });
            } else if (viewType === 'Item Details') {
                await client.navigateTo({ url: `transactions/item_details/${transactionValue}/${childValue}${qsValue}` });
            } else if (viewType === 'Matrix') {
                await client.navigateTo({ url: `transactions/matrix/${transactionValue}/${childValue}${qsValue}` });
            }
        }
    }

    private async navigateToComplexUrl(navigateToType: NavigationType, data: BaseNavigateToConifuration, context: IContext, client: IClient) {

        if (isObjectNavigationType(navigateToType)) {
            const value = this.getParamValue((data as NavigateToObjectConifuration).ObjectData, context);

            if (navigateToType === 'Account Dashboard') {
                await client.navigateTo({ url: `accounts/home_page/${value}`, history: 'ClearTo' });
            } else if (navigateToType === 'Activity') {
                await client.navigateTo({ url: `activities/details/${value}` });
            } else if (navigateToType === 'Survey') {
                await client.navigateTo({ url: `surveys?survey_key=${value}` });
            } else if (navigateToType === 'Slug') {
                await client.navigateTo({ url: `${value}` });
            } else if (navigateToType === 'Custom') {
                await client.navigateTo({ url: `${value}` });
            }
        } else if (navigateToType === 'Activities') {
            await this.navigateToActivitiesUrl(data, context, client);
        } else if (navigateToType === 'Transaction') {
            await this.navigateToTransactionUrl(data, context, client);
        }
    }

    async navigateTo(body: NavigateToConfiguration, context: IContext | undefined) {
        if (context) {
            const client: IClient | undefined = context?.client || undefined;

            if (client) {
                const data = body.Data || {};
                const navigateToType: NavigationType | undefined = data.Type;

                if (navigateToType) {
                    if (navigateToType === 'Home') {
                        await client.navigateTo({ url: 'homepage', history: 'ClearAll' });
                    } else if (navigateToType === 'Back') {
                        await client.navigateTo({ url: 'back' });
                    } else if (navigateToType === 'Accounts') {
                        await client.navigateTo({ url: 'list/accounts', history: 'ClearTo' });
                    } else if (navigateToType === 'Users') {
                        await client.navigateTo({ url: 'list/users' });
                    } else if (navigateToType === 'Contacts') {
                        await client.navigateTo({ url: 'list/contacts' });
                    } else if (navigateToType === 'Items') {
                        await client.navigateTo({ url: 'list/items' });
                    } else {
                        this.navigateToComplexUrl(navigateToType, data, context, client);
                    }
                }
            }
        }

    }
}
export default NavigateToCpiService;
