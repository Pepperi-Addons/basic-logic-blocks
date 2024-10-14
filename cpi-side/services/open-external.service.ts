import { IClient } from "@pepperi-addons/cpi-node/build/cpi-side/events";
import { OpenExternalConifuration, UrlType } from "shared";
import BaseCpiService from "./base-cpi.service";

class OpenExternalCpiService extends BaseCpiService {

    async openExternal(body: any, context: any) {
        if (context) {
            const client: IClient | undefined = context?.client || undefined;

            if (client) {
                const openExternalType: UrlType = body.Type || 'external-app';
                const value = this.getParamValue((body as OpenExternalConifuration).URL, context);

                if (openExternalType === 'external-app') {
                    client.openURI({
                        uri: value
                    });
                } else if (openExternalType === 'browser') {
                    client.openBrowser({
                        url: value
                    });
                }
            }
        }
    }
}
export default OpenExternalCpiService;