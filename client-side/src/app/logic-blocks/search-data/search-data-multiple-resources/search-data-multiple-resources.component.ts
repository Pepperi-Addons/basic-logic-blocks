import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IPepGenericListActions,
  IPepGenericListDataSource,
  IPepGenericListParams,
} from "@pepperi-addons/ngx-composite-lib/generic-list";
import { IPepFormFieldClickEvent } from "@pepperi-addons/ngx-lib/form";
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

// here component name should be in following structure <componentName+LogicBlockComponent>
// <SearchDataMultipleResources+LogicBlockComponent> = SearchDataMultipleResourcesLogicBlockComponent
// Also here we are extending SearchDataLogicBlockComponent to get the flow configuration from the logic blocks
export class SearchDataMultipleResourcesLogicBlockComponent extends BaseLogicBlockDirective {
  listEmptyState = {
    show: true,
  };
  get currentConfiguration(): SearchDataConifuration {
    return this._currentConfiguration as SearchDataConifuration;
  }
  protected getTitleResourceKey(): string {
    return "SEARCH_DATA.TITLE";
  }

  protected loadDataOnInit(): void {
    console.log(
      "loadDataOnInit() overrided method call",
      this.hostObject,
      "\n ..... ",
      this.currentConfiguration
    );
    this.run();
  }
  protected calculateDoneIsDisabled(): boolean {
    return false;
  }
  protected createDefaultConfiguration(): SearchDataConifuration | undefined {
    const config: SearchDataConifuration = {
      Resource: "",
      ResourceFields: [],
      IsAsc: true,
      PageSize: 10,
      SaveResultIn: "",
    };
    return config;
  }

  searchDataListItems: SearchDataConifuration[] = [];
  isLoaded: boolean = false;
  listDataSource: IPepGenericListDataSource;
  constructor(
    private dialogService: DialogService,
    viewContainerRef: ViewContainerRef,
    protected logicBlockService: SearchDataLogicBlockService,
    public addonBlockService: PepAddonBlockLoaderService,
    public translate: TranslateService
  ) {
    super(viewContainerRef, translate, logicBlockService);
    console.log(
      "constructore loaded from SearchDataMultipleResourcesLogicBlockComponent!!!!",
      this.searchDataListItems
    );
  }

  async run() {
    this.listDataSource = this.getDataSource();
    this.isLoaded = true;
  }
  isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  getDataSource(): IPepGenericListDataSource {
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
              {
                FieldID: "Resource",
                Type: "TextBox",
                Title: "Resource",
                Mandatory: false,
                ReadOnly: true,
              },
              {
                FieldID: "ResourceFields",
                Type: "TextBox",
                Title: "Fields",
                Mandatory: false,
                ReadOnly: true,
              },
              {
                FieldID: "SaveResultIn",
                Type: "TextBox",
                Title: "Destination",
                Mandatory: false,
                ReadOnly: true,
              },
            ],
            Columns: [
              {
                Width: 10,
              },
              {
                Width: 10,
              },
              {
                Width: 10,
              },
            ],
            FrozenColumnsCount: 0,
            MinimumColumnWidth: 0,
          },
          items: this.searchDataListItems,
          totalCount: this.searchDataListItems.length,
        });
      },
      inputs: {
        pager: {
          type: "scroll",
        },
        selectionType: "single",
      },
    };
  }

  listActions: IPepGenericListActions = {
    get: async (selectedData: PepSelectionData) => {
      let actions = [];
      if (selectedData.rows.length === 1) {
        actions.push({
          title: this.translate.instant("Edit"),
          handler: async (selectedData) => {
            console.log("Edit selected called with item key", selectedData);
            // Get the selected row ID
            const selectedRowID = selectedData.rows[0];
            const selectedItem = this.searchDataListItems.find(
              (item) => item.Resource === selectedRowID
            );
            // Set the selected item as the Configuration
            this.hostObject.Configuration = selectedItem;
            // Open the dialog with the selected item as the configuration
            this.dialogService.openDialog(
              this.translate.instant("SEARCH_DATA.TITLE"),
              SearchDataLogicBlockComponent,
              [],
              this.hostObject,
              this.addResourceCB
            );
          },
        });

        actions.push({
          title: this.translate.instant("Delete"),
          handler: async (selectedData) => {
            // this handler should do two things..
            //1. delete the selected item from searchDataListItems
            //2. delete the selected item from currentConfiguration too.
            console.log("Delete selected called with item key", selectedData);
            const selectedRowID = selectedData.rows[0];
            const indexToRemove = this.searchDataListItems.findIndex(
              (item) => item.Resource === selectedRowID
            );

            // If the item exists, remove it from the list
            if (indexToRemove !== -1) {
              this.searchDataListItems.splice(indexToRemove, 1);
              this.reload();
              this.hostObject.Configuration = this.searchDataListItems;
              // handle this gracefully
              this._currentConfiguration = this.searchDataListItems;
            }
          },
        });
      }
      return actions;
    },
  };

  reload() {
    this.listDataSource = this.getDataSource();
  }

  addResourceCB = async (data) => {
    console.log(
      "callback will called from SearchData component with updated data, upon done button clicked",
      data
    );
    if (data) {
      this.searchDataListItems.push(data);
      this.reload();
      //handle this gracfully here.
      this._currentConfiguration.Configuration = data;
      this.hostObject.Configuration = this.searchDataListItems;
    }
  };

  addResource() {
    this.hostObject.Configuration = this.currentConfiguration;
    this.dialogService.openDialog(
      this.translate.instant("SEARCH_DATA.TITLE"),
      SearchDataLogicBlockComponent,
      [],
      { ...this.hostObject, isAddClicked: true },
      this.addResourceCB
    );
  }
}
