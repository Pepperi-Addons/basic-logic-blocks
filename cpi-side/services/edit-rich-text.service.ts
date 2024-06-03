import BaseCpiService from "./base-cpi.service";

class EditRichTextCpiService extends BaseCpiService {
    async findReplaceText(body: any, context: any) {
        let configurationRes = '';
        if (context) {
            configurationRes = context[body.Object.FlowParamSource] || context['configuration'];
            const findStr = this.getDynamicPageParamValue(body?.Find, context);
            const replaceStr =this.getDynamicPageParamValue(body?.Replace, context);

            configurationRes['RichText'] = configurationRes['RichText'].replace(new RegExp(findStr, 'g'), replaceStr);
            return configurationRes;
        }
    }

    private getDynamicPageParamValue(value: any, context: any) {
        if (value && value.FlowParamSource === 'Static') {
            return value.Value || '';
        }
        else if (value && value.FlowParamSource === 'Dynamic') {
            const pageParams = context.State?.PageParameters || {};
            return pageParams[value.Value] || '';
        }

        return value.Value;
    }
}
export default EditRichTextCpiService;
