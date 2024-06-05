import { PapiClient, Relation } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';

export class RelationsService {

    papiClient: PapiClient
    bundleFileName = '';

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });

        this.bundleFileName = `file_${this.client.AddonUUID}`;
    }

    // For page block template
    private async upsertRelation(relation): Promise<Relation> {
        return await this.papiClient.addons.data.relations.upsert(relation);
    }

    private async createLogicBlockRelation(name: string, elementNamePrefix: string, executionRelativeURL: string, componentNamePrefix = '', title = ''): Promise<any> {
        componentNamePrefix = componentNamePrefix.length > 0 ? componentNamePrefix : name.trim();

        const logicBlockRelation: Relation = {
            RelationName: 'LogicBlock',
            Name: name,
            Description: `${name} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: this.bundleFileName,
            ComponentName: `${componentNamePrefix}LogicBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `${componentNamePrefix}LogicBlockkModule`, // This is should be the block module name (from the client-side),
            ElementsModule: 'WebComponents',
            ElementName: `${elementNamePrefix}-logic-block-element-${this.client.AddonUUID}`,
            BlockExecutionRelativeURL: executionRelativeURL,
            Hidden: false,
            Title: title || name,
        };

        return await this.upsertRelation(logicBlockRelation);
    }

    private async createNavigateToLogicBlockRelation(): Promise<any> {
        return await this.createLogicBlockRelation('Navigate To', 'navigate-to', '/addon-cpi/navigate_to');
        // const blockName = 'Navigate To';

        // const logicBlockRelation: Relation = {
        //     RelationName: 'LogicBlock',
        //     Name: blockName,
        //     Description: `${blockName} block`,
        //     Type: "NgComponent",
        //     SubType: "NG14",
        //     AddonUUID: this.client.AddonUUID,
        //     AddonRelativeURL: this.bundleFileName,
        //     ComponentName: `NavigateToLogicBlockComponent`, // This is should be the block component name (from the client-side)
        //     ModuleName: `NavigateToLogicBlockModule`, // This is should be the block module name (from the client-side),
        //     ElementsModule: 'WebComponents',
        //     ElementName: `navigate-to-logic-block-element-${this.client.AddonUUID}`,
        //     BlockExecutionRelativeURL: '/addon-cpi/navigate_to',
        // };

        // return await this.upsertRelation(logicBlockRelation);
    }

    private async createActiveTransactionLogicBlockRelation(): Promise<any> {
        return await this.createLogicBlockRelation('Active Transaction', 'active-transaction', '/addon-cpi/get_active_transaction_uuid');
        // const blockName = 'Active Transaction';

        // const logicBlockRelation: Relation = {
        //     RelationName: 'LogicBlock',
        //     Name: blockName,
        //     Description: `${blockName} block`,
        //     Type: "NgComponent",
        //     SubType: "NG14",
        //     AddonUUID: this.client.AddonUUID,
        //     AddonRelativeURL: this.bundleFileName,
        //     ComponentName: `ActiveTransactionLogicBlockComponent`, // This is should be the block component name (from the client-side)
        //     ModuleName: `ActiveTransactionLogicBlockModule`, // This is should be the block module name (from the client-side),
        //     ElementsModule: 'WebComponents',
        //     ElementName: `active-transaction-logic-block-element-${this.client.AddonUUID}`,
        //     BlockExecutionRelativeURL: '/addon-cpi/get_active_transaction_uuid',
        // };

        // return await this.upsertRelation(logicBlockRelation);
    }

    private async createGetValuesLogicBlockRelation(): Promise<any> {
        return await this.createLogicBlockRelation('Get Values', 'get-values', '/addon-cpi/get_values');
        // const blockName = 'Get Values';

        // const logicBlockRelation: Relation = {
        //     RelationName: 'LogicBlock',
        //     Name: blockName,
        //     Description: `${blockName} block`,
        //     Type: "NgComponent",
        //     SubType: "NG14",
        //     AddonUUID: this.client.AddonUUID,
        //     AddonRelativeURL: this.bundleFileName,
        //     ComponentName: `GetValuesLogicBlockComponent`, // This is should be the block component name (from the client-side)
        //     ModuleName: `GetValuesLogicBlockModule`, // This is should be the block module name (from the client-side),
        //     ElementsModule: 'WebComponents',
        //     ElementName: `get-values-logic-block-element-${this.client.AddonUUID}`,
        //     BlockExecutionRelativeURL: '/addon-cpi/get_values',
        // };

        // return await this.upsertRelation(logicBlockRelation);
    }

    private async createCreateTransactionLogicBlockRelation(): Promise<any> {
        return await this.createLogicBlockRelation('Create Transaction', 'create-transaction', '/addon-cpi/create_transaction_uuid');
        // const blockName = 'Create Transaction';

        // const logicBlockRelation: Relation = {
        //     RelationName: 'LogicBlock',
        //     Name: blockName,
        //     Description: `${blockName} block`,
        //     Type: "NgComponent",
        //     SubType: "NG14",
        //     AddonUUID: this.client.AddonUUID,
        //     AddonRelativeURL: this.bundleFileName,
        //     ComponentName: `CreateTransactionLogicBlockComponent`, // This is should be the block component name (from the client-side)
        //     ModuleName: `CreateTransactionLogicBlockModule`, // This is should be the block module name (from the client-side),
        //     ElementsModule: 'WebComponents',
        //     ElementName: `create-transaction-logic-block-element-${this.client.AddonUUID}`,
        //     BlockExecutionRelativeURL: '/addon-cpi/create_transaction_uuid',
        // };

        // return await this.upsertRelation(logicBlockRelation);
    }

    private async createCreateActivityLogicBlockRelation(): Promise<any> {
        return await this.createLogicBlockRelation('Create Activity', 'create-activity', '/addon-cpi/create_activity_uuid');
        // const blockName = 'Create Activity';

        // const logicBlockRelation: Relation = {
        //     RelationName: 'LogicBlock',
        //     Name: blockName,
        //     Description: `${blockName} block`,
        //     Type: "NgComponent",
        //     SubType: "NG14",
        //     AddonUUID: this.client.AddonUUID,
        //     AddonRelativeURL: this.bundleFileName,
        //     ComponentName: `CreateActivityLogicBlockComponent`, // This is should be the block component name (from the client-side)
        //     ModuleName: `CreateActivityLogicBlockModule`, // This is should be the block module name (from the client-side),
        //     ElementsModule: 'WebComponents',
        //     ElementName: `create-activity-logic-block-element-${this.client.AddonUUID}`,
        //     BlockExecutionRelativeURL: '/addon-cpi/create_activity_uuid',
        // };

        // return await this.upsertRelation(logicBlockRelation);
    }

    private async createCreateSurveyLogicBlockRelation(): Promise<any> {
        return await this.createLogicBlockRelation('Create Survey', 'create-survey', '/addon-cpi/create_survey_uuid');
        // const blockName = 'Create Survey';

        // const logicBlockRelation: Relation = {
        //     RelationName: 'LogicBlock',
        //     Name: blockName,
        //     Description: `${blockName} block`,
        //     Type: "NgComponent",
        //     SubType: "NG14",
        //     AddonUUID: this.client.AddonUUID,
        //     AddonRelativeURL: this.bundleFileName,
        //     ComponentName: `CreateSurveyLogicBlockComponent`, // This is should be the block component name (from the client-side)
        //     ModuleName: `CreateSurveyLogicBlockModule`, // This is should be the block module name (from the client-side),
        //     ElementsModule: 'WebComponents',
        //     ElementName: `create-survey-logic-block-element-${this.client.AddonUUID}`,
        //     BlockExecutionRelativeURL: '/addon-cpi/create_survey_uuid',
        // };

        // return await this.upsertRelation(logicBlockRelation);
    }

    private async createOpenExternalLogicBlockRelation(): Promise<any> {
        return await this.createLogicBlockRelation('Open external', 'open-external', '/addon-cpi/open_external', 'OpenExternal');
        // const blockName = 'Open external';

        // const logicBlockRelation: Relation = {
        //     RelationName: 'LogicBlock',
        //     Name: blockName,
        //     Description: `${blockName} block`,
        //     Type: "NgComponent",
        //     SubType: "NG14",
        //     AddonUUID: this.client.AddonUUID,
        //     AddonRelativeURL: this.bundleFileName,
        //     ComponentName: `OpenExternalLogicBlockComponent`, // This is should be the block component name (from the client-side)
        //     ModuleName: `OpenExternalLogicBlockModule`, // This is should be the block module name (from the client-side),
        //     ElementsModule: 'WebComponents',
        //     ElementName: `open-external-logic-block-element-${this.client.AddonUUID}`,
        //     BlockExecutionRelativeURL: '/addon-cpi/open_external',
        // };

        // return await this.upsertRelation(logicBlockRelation);
    }

    private async createEditRichTextLogicBlockRelation(): Promise<any> {
        return await this.createLogicBlockRelation('Rich Text - Find Replace', 'edit-rich-text', '/addon-cpi/edit_rich_text', 'EditRichText', 'Rich Text - Find & Replace');
        // const blockName = 'Rich Text - Find Replace';

        // const logicBlockRelation: Relation = {
        //     RelationName: 'LogicBlock',
        //     Name: blockName,
        //     Description: `${blockName} block`,
        //     Type: "NgComponent",
        //     SubType: "NG14",
        //     AddonUUID: this.client.AddonUUID,
        //     AddonRelativeURL: this.bundleFileName,
        //     ComponentName: `EditRichTextLogicBlockComponent`, // This is should be the block component name (from the client-side)
        //     ModuleName: `EditRichTextLogicBlockkModule`, // This is should be the block module name (from the client-side),
        //     ElementsModule: 'WebComponents',
        //     ElementName: `edit-rich-text-logic-block-element-${this.client.AddonUUID}`,
        //     BlockExecutionRelativeURL: '/addon-cpi/edit_rich_text',
        //     Hidden: false,
        //     Title: 'Rich Text - Find & Replace',
        // };

        // return await this.upsertRelation(logicBlockRelation);
    }

    private async createExtractValueLogicBlockRelation(): Promise<any> {
        return await this.createLogicBlockRelation('Extract Value', 'extract-value', '/addon-cpi/extract_value');
        // const blockName = 'Extract Value';

        // const logicBlockRelation: Relation = {
        //     RelationName: 'LogicBlock',
        //     Name: blockName,
        //     Description: `${blockName} block`,
        //     Type: "NgComponent",
        //     SubType: "NG14",
        //     AddonUUID: this.client.AddonUUID,
        //     AddonRelativeURL: this.bundleFileName,
        //     ComponentName: `ExtractValueLogicBlockComponent`, // This is should be the block component name (from the client-side)
        //     ModuleName: `ExtractValueLogicBlockkModule`, // This is should be the block module name (from the client-side),
        //     ElementsModule: 'WebComponents',
        //     ElementName: `extract-value-logic-block-element-${this.client.AddonUUID}`,
        //     BlockExecutionRelativeURL: '/addon-cpi/extract_value',
        //     Hidden: false,
        //     Title: 'Extract Value',
        // };

        // return await this.upsertRelation(logicBlockRelation);
    }

    private async createSearchDataLogicBlockRelation(): Promise<any> {
        return await this.createLogicBlockRelation('Search Data', 'search-data', '/addon-cpi/search_data');
        // const blockName = 'Search Data';

        // const logicBlockRelation: Relation = {
        //     RelationName: 'LogicBlock',
        //     Name: blockName,
        //     Description: `${blockName} block`,
        //     Type: "NgComponent",
        //     SubType: "NG14",
        //     AddonUUID: this.client.AddonUUID,
        //     AddonRelativeURL: this.bundleFileName,
        //     ComponentName: `SearchDataLogicBlockComponent`, // This is should be the block component name (from the client-side)
        //     ModuleName: `SearchDataLogicBlockModule`, // This is should be the block module name (from the client-side),
        //     ElementsModule: 'WebComponents',
        //     ElementName: `search-data-logic-block-element-${this.client.AddonUUID}`,
        //     BlockExecutionRelativeURL: '/addon-cpi/search_data',
        // };

        // return await this.upsertRelation(logicBlockRelation);
    }

    async upsertRelations(): Promise<boolean> {
        const dataPromises: Promise<any>[] = [];

        // Create the logic blocks.
        dataPromises.push(this.createNavigateToLogicBlockRelation());
        dataPromises.push(this.createActiveTransactionLogicBlockRelation());
        dataPromises.push(this.createGetValuesLogicBlockRelation());
        dataPromises.push(this.createCreateTransactionLogicBlockRelation());
        dataPromises.push(this.createCreateActivityLogicBlockRelation());
        dataPromises.push(this.createCreateSurveyLogicBlockRelation());
        dataPromises.push(this.createOpenExternalLogicBlockRelation());
        dataPromises.push(this.createEditRichTextLogicBlockRelation());
        dataPromises.push(this.createExtractValueLogicBlockRelation());
        dataPromises.push(this.createSearchDataLogicBlockRelation());

        await Promise.all(dataPromises);

        return true;
    }
}
