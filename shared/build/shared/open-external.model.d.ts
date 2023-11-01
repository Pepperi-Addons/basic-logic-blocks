import { ConifurationProperty } from "./common.model";
export type UrlType = 'external-app' | 'browser';
export interface OpenExternalConifuration {
    URL: ConifurationProperty;
    Type: UrlType;
}
