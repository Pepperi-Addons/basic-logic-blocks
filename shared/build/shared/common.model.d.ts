export type FlowParamSource = 'Static' | 'Dynamic';
export interface ConifurationProperty {
    FlowParamSource?: FlowParamSource;
    Value?: any;
}
