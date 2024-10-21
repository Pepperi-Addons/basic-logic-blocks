import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IPepGenericListActions,
  IPepGenericListDataSource,
  IPepGenericListParams,
} from "@pepperi-addons/ngx-composite-lib/generic-list";
import { PepSelectionData } from "@pepperi-addons/ngx-lib/list";
import { SearchDataLogicBlockComponent } from "../search-data.component";
import { SearchDataLogicBlockService } from "../search-data.service";
import { PepAddonBlockLoaderService } from "@pepperi-addons/ngx-lib/remote-loader";
import { BaseLogicBlockDirective } from "src/app/shared/components/base-logic-block.directive/base-logic-block.directive";
import { SearchDataConifuration } from "shared";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  templateUrl: "./search-data-multiple-resources.component.html",
  styleUrls: ["./search-data-multiple-resources.component.scss"],
  providers: [SearchDataLogicBlockService],
})
export class SearchDataMultipleResourcesLogicBlockComponent extends BaseLogicBlockDirective {
  // Class Properties
  listEmptyState = {
    show: true,
  };
  resourceSet: Set<string> = new Set();
  isLoaded: boolean = false;
  listDataSource: IPepGenericListDataSource;
  listActions: IPepGenericListActions = this.getListActions();

  // Constructor
  constructor(
    private dialogService: DialogService,
    viewContainerRef: ViewContainerRef,
    protected logicBlockService: SearchDataLogicBlockService,
    public addonBlockService: PepAddonBlockLoaderService,
    public translate: TranslateService
  ) {
    super(viewContainerRef, translate, logicBlockService);
    console.log("Constructor initialized in SearchDataMultipleResourcesLogicBlockComponent!");
  }

  // Getter/Setter
  get currentConfiguration(): SearchDataConifuration {
    return this._currentConfiguration as SearchDataConifuration;
  }

  // Public Methods

  addResourceCB = async (data: SearchDataConifuration) => {
    if (data && !this.resourceSet.has(data.Resource)) {
      this.resourceSet.add(data.Resource);
      this._currentConfiguration.push(data);
      console.log(`Added new resource: ${data.Resource}`);
    } else {
      const existingIndex = this._currentConfiguration.findIndex(config => config.Resource === data.Resource);
      if (existingIndex !== -1) {
        this._currentConfiguration[existingIndex] = data;
        console.log(`Replaced existing resource: ${data.Resource}`);
      }
    }

    this.reload();
    this.hostObject.Configuration = this._currentConfiguration;
  };

  addResource() {
    this.hostObject.Configuration = this._currentConfiguration;
    console.log("Before add/edit, currentConfiguration:", this._currentConfiguration);
    this.dialogService.openDialog(
      this.translate.instant("SEARCH_DATA.TITLE"),
      SearchDataLogicBlockComponent,
      [],
      { ...this.hostObject, isAddClicked: true },
      this.addResourceCB
    );
  }

  reload() {
    const filteredConfig = this._currentConfiguration.filter(config => config.Resource !== "");
    this.listDataSource = this.getDataSource(filteredConfig);
  }

  // Protected Methods

  // Lifecycle Hooks Overridden method will come below
  protected loadDataOnInit(): void {
    this.run();
  }

  // Overridden
  protected getTitleResourceKey(): string {
    return "SEARCH_DATA.TITLE";
  }

  // Overridden
  protected calculateDoneIsDisabled(): boolean {
    return false;
  }
  // Overridden
  protected createDefaultConfiguration(): SearchDataConifuration[] {
    const config: SearchDataConifuration = {
      Resource: "",
      ResourceFields: [],
      IsAsc: true,
      PageSize: 10,
      SaveResultIn: "",
    };
    return [config];
  }

  async run() {
    const filteredConfig = this._currentConfiguration.filter(config => config.Resource !== "");
    filteredConfig.forEach(config => this.resourceSet.add(config.Resource));
    this.listDataSource = this.getDataSource(filteredConfig); 
    this.isLoaded = true;
  }

  // Private Methods

  private getListActions(): IPepGenericListActions {
    return {
      get: async (selectedData: PepSelectionData) => {
        let actions = [];
        if (selectedData.rows.length === 1) {
          actions.push({
            title: this.translate.instant("Edit"),
            handler: async (selectedData) => this.handleEditAction(selectedData),
          });
          actions.push({
            title: this.translate.instant("Delete"),
            handler: async (selectedData) => this.handleDeleteAction(selectedData),
          });
        }
        return actions;
      },
    };
  }

  private async handleEditAction(selectedData: PepSelectionData) {
    const selectedRowID = selectedData.rows[0];
    const selectedItem = this._currentConfiguration.find(item => item.Resource === selectedRowID);
    this.hostObject.Configuration = selectedItem;
    this.dialogService.openDialog(
      this.translate.instant("SEARCH_DATA.TITLE"),
      SearchDataLogicBlockComponent,
      [],
      this.hostObject,
      this.addResourceCB
    );
  }

  private async handleDeleteAction(selectedData: PepSelectionData) {
    const selectedRowID = selectedData.rows[0];
    const indexToRemove = this._currentConfiguration.findIndex(item => item.Resource === selectedRowID);
    if (indexToRemove !== -1) {
      this._currentConfiguration.splice(indexToRemove, 1);
      this.resourceSet.delete(selectedRowID);
      this.reload();
      this.hostObject.Configuration = this._currentConfiguration;
    }
  }

  // Separated method to generate data source
  private getDataSource(filteredConfig: SearchDataConifuration[]): IPepGenericListDataSource {
    return {
      init: async (parameters: IPepGenericListParams) => {
        return Promise.resolve({
          dataView: {
            Context: {
              Name: "",
              Profile: { InternalID: 0 },
              ScreenSize: "Landscape",
            },
            Type: "Grid",
            Title: "Resource list",
            Fields: [
              { FieldID: "Resource", Type: "TextBox", Title: "Resource", Mandatory: false, ReadOnly: true },
              { FieldID: "ResourceFields", Type: "TextBox", Title: "Fields", Mandatory: false, ReadOnly: true },
              { FieldID: "SaveResultIn", Type: "TextBox", Title: "Destination", Mandatory: false, ReadOnly: true },
            ],
            Columns: [{ Width: 10 }, { Width: 10 }, { Width: 10 }],
            FrozenColumnsCount: 0,
            MinimumColumnWidth: 0,
          },
          items: filteredConfig,
          totalCount: filteredConfig.length,
        });
      },
      inputs: {
        pager: { type: "scroll" },
        selectionType: "single",
      },
    };
  }
}
