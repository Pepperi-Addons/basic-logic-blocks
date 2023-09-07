export interface GetValueOption {
    Key: string;
    Title: string;
}
export type valuesType = 'manual' | 'mapped';
export interface GetValuesConifuration {
    ValuesType: valuesType;
    ManualOptions: {
        key: string;
        value: string;
    }[];
    MappedData?: GetValuesMappedConifuration;
}
export interface GetValuesMappedConifuration {
    Resource?: string;
    ResourceOptionKeyField?: string;
    ResourceOptionTitleField?: string;
    ResourceQuery?: any;
}
