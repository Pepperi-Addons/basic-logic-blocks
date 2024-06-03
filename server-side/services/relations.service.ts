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

    private async createNavigateToLogicBlockRelation(): Promise<any> {
        const blockName = 'Navigate To';

        const filename = `file_${this.client.AddonUUID}`;

        const logicBlockRelation: Relation = {
            RelationName: 'LogicBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `NavigateToLogicBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `NavigateToLogicBlockModule`, // This is should be the block module name (from the client-side),
            ElementsModule: 'WebComponents',
            ElementName: `navigate-to-logic-block-element-${this.client.AddonUUID}`,
            BlockExecutionRelativeURL: '/addon-cpi/navigate_to',
        };

        return await this.upsertRelation(logicBlockRelation);
    }

    private async createActiveTransactionLogicBlockRelation(): Promise<any> {
        const blockName = 'Active Transaction';

        const filename = `file_${this.client.AddonUUID}`;

        const logicBlockRelation: Relation = {
            RelationName: 'LogicBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `ActiveTransactionLogicBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `ActiveTransactionLogicBlockModule`, // This is should be the block module name (from the client-side),
            ElementsModule: 'WebComponents',
            ElementName: `active-transaction-logic-block-element-${this.client.AddonUUID}`,
            BlockExecutionRelativeURL: '/addon-cpi/get_active_transaction_uuid',
        };

        return await this.upsertRelation(logicBlockRelation);
    }

    private async createGetValuesLogicBlockRelation(): Promise<any> {
        const blockName = 'Get Values';

        const filename = `file_${this.client.AddonUUID}`;

        const logicBlockRelation: Relation = {
            RelationName: 'LogicBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `GetValuesLogicBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `GetValuesLogicBlockModule`, // This is should be the block module name (from the client-side),
            ElementsModule: 'WebComponents',
            ElementName: `get-values-logic-block-element-${this.client.AddonUUID}`,
            BlockExecutionRelativeURL: '/addon-cpi/get_values',
        };

        return await this.upsertRelation(logicBlockRelation);
    }

    private async createCreateTransactionLogicBlockRelation(): Promise<any> {
        const blockName = 'Create Transaction';

        const filename = `file_${this.client.AddonUUID}`;

        const logicBlockRelation: Relation = {
            RelationName: 'LogicBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `CreateTransactionLogicBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `CreateTransactionLogicBlockModule`, // This is should be the block module name (from the client-side),
            ElementsModule: 'WebComponents',
            ElementName: `create-transaction-logic-block-element-${this.client.AddonUUID}`,
            BlockExecutionRelativeURL: '/addon-cpi/create_transaction_uuid',
        };

        return await this.upsertRelation(logicBlockRelation);
    }

    private async createCreateActivityLogicBlockRelation(): Promise<any> {
        const blockName = 'Create Activity';

        const filename = `file_${this.client.AddonUUID}`;

        const logicBlockRelation: Relation = {
            RelationName: 'LogicBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `CreateActivityLogicBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `CreateActivityLogicBlockModule`, // This is should be the block module name (from the client-side),
            ElementsModule: 'WebComponents',
            ElementName: `create-activity-logic-block-element-${this.client.AddonUUID}`,
            BlockExecutionRelativeURL: '/addon-cpi/create_activity_uuid',
        };

        return await this.upsertRelation(logicBlockRelation);
    }

    private async createCreateSurveyLogicBlockRelation(): Promise<any> {
        const blockName = 'Create Survey';

        const filename = `file_${this.client.AddonUUID}`;

        const logicBlockRelation: Relation = {
            RelationName: 'LogicBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `CreateSurveyLogicBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `CreateSurveyLogicBlockModule`, // This is should be the block module name (from the client-side),
            ElementsModule: 'WebComponents',
            ElementName: `create-survey-logic-block-element-${this.client.AddonUUID}`,
            BlockExecutionRelativeURL: '/addon-cpi/create_survey_uuid',
        };

        return await this.upsertRelation(logicBlockRelation);
    }

    private async createOpenExternalLogicBlockRelation(): Promise<any> {
        const blockName = 'Open external';

        const filename = `file_${this.client.AddonUUID}`;

        const logicBlockRelation: Relation = {
            RelationName: 'LogicBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `OpenExternalLogicBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `OpenExternalLogicBlockModule`, // This is should be the block module name (from the client-side),
            ElementsModule: 'WebComponents',
            ElementName: `open-external-logic-block-element-${this.client.AddonUUID}`,
            BlockExecutionRelativeURL: '/addon-cpi/open_external',
        };

        return await this.upsertRelation(logicBlockRelation);
    }

    private async createEditRichTextLogicBlockRelation(): Promise<any> {
        const blockName = 'Rich Text - Find Replace';

        const filename = `file_${this.client.AddonUUID}`;

        const logicBlockRelation: Relation = {
            RelationName: 'LogicBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `EditRichTextLogicBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `EditRichTextLogicBlockkModule`, // This is should be the block module name (from the client-side),
            ElementsModule: 'WebComponents',
            ElementName: `edit-rich-text-logic-block-element-${this.client.AddonUUID}`,
            BlockExecutionRelativeURL: '/addon-cpi/edit_rich_text',
            Hidden: false,
            Title: 'Rich Text - Find & Replace',
        };

        return await this.upsertRelation(logicBlockRelation);
    }


    private async createExtractValueLogicBlockRelation(): Promise<any> {
        const blockName = 'Extract Value';

        const filename = `file_${this.client.AddonUUID}`;

        const logicBlockRelation: Relation = {
            RelationName: 'LogicBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `ExtractValueLogicBlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `ExtractValueLogicBlockkModule`, // This is should be the block module name (from the client-side),
            ElementsModule: 'WebComponents',
            ElementName: `extract-value-logic-block-element-${this.client.AddonUUID}`,
            BlockExecutionRelativeURL: '/addon-cpi/extract_value',
            Hidden: false,
            Title: 'Extract Value',
        };

        return await this.upsertRelation(logicBlockRelation);
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

        await Promise.all(dataPromises);

        return true;
    }
}
