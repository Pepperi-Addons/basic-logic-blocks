
export interface SearchDataOption {
    Key: string;
    Title: string;
}

// export type valuesType = 'manual' | 'mapped';
export interface SearchDataConifuration {
    // ValuesType: valuesType;
    ManualOptions: { key: string, value: string }[]; // IPepOption[];
    MappedData?: SearchDataMappedConifuration;
}

export interface SearchDataMappedConifuration {
    Resource?: string;
    ResourceOptionKeyField?: string;
    ResourceOptionTitleField?: string;
    ResourceQuery?: any;
}
