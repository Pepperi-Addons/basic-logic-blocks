import { ConifurationProperty } from "./common.model";
export type ActivitiesViewsType = 'All Lists' | 'Single List' | '';
export type TransactionViewsType = 'Order Center' | 'Item Details' | 'Matrix' | 'Cart' | 'Header' | '';
export interface NavigateToConfiguration {
    Data: BaseNavigateToConifuration;
}
export interface BaseNavigateToConifuration {
    Type?: NavigationType;
    ViewType?: any;
    [key: string]: any;
}
export interface NavigateToStaticConifuration extends BaseNavigateToConifuration {
    Type: StaticNavigationType;
}
export interface NavigateToObjectConifuration extends BaseNavigateToConifuration {
    Type: ObjectNavigationType;
    ObjectData: ConifurationProperty;
}
export interface NavigateToActivitiesConifuration extends BaseNavigateToConifuration {
    Type: ActivitiesNavigationType;
    ViewType: ActivitiesViewsType;
    ActivitiesData: ConifurationProperty;
}
export interface NavigateToTransactionConifuration extends BaseNavigateToConifuration {
    Type: TransactionNavigationType;
    ViewType: TransactionViewsType;
    TransactionData: ConifurationProperty;
    ChildTransactionData: ConifurationProperty;
    QsTransactionData: ConifurationProperty;
}
export type StaticNavigationType = 'Home' | 'Back' | 'Accounts' | 'Users' | 'Contacts' | 'Items';
export type ObjectNavigationType = 'Account Dashboard' | 'Activity' | 'Survey' | 'Slug' | 'Custom';
export type ActivitiesNavigationType = 'Activities';
export type TransactionNavigationType = 'Transaction';
export type NavigationType = StaticNavigationType | ObjectNavigationType | ActivitiesNavigationType | TransactionNavigationType;
