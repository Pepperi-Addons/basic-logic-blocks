import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListParams } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { IPepFormFieldClickEvent } from '@pepperi-addons/ngx-lib/form';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { SearchDataLogicBlockComponent } from '../search-data.component';
import { SearchDataLogicBlockService } from '../search-data.service';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { BaseLogicBlockDirective } from 'src/app/shared/components/base-logic-block.directive/base-logic-block.directive';

@Component({
  templateUrl: './search-data-multiple-resources.component.html',
  styleUrls: ['./search-data-multiple-resources.component.scss'],
  providers: [SearchDataLogicBlockService]
})

// here component name should be in following structure <componentName+LogicBlockComponent> 
// <SearchDataMultipleResources+LogicBlockComponent> = SearchDataMultipleResourcesLogicBlockComponent
// Also here we are extending SearchDataLogicBlockComponent to get the flow configuration from the logic blocks
export class SearchDataMultipleResourcesLogicBlockComponent extends SearchDataLogicBlockComponent {

  items = [];
  isLoaded: boolean = false;
  listDataSource: IPepGenericListDataSource;
  constructor(
    viewContainerRef: ViewContainerRef,
        protected logicBlockService: SearchDataLogicBlockService,
        public addonBlockService: PepAddonBlockLoaderService,
        public translate: TranslateService,
  ) {
    super(viewContainerRef, translate,logicBlockService, addonBlockService);
    this.items = [];
    console.log('constructore loaded from SearchDataMultipleResourcesLogicBlockComponent!!!!', this.items);
   }

   async run() {
    console.log('run() called!!!!!')
    this.listDataSource = this.getDataSource();
    this.isLoaded = true;
}

  ngOnInit(): void {
    this.run();
  }

  async onListClicked($event: IPepFormFieldClickEvent)
    {
        console.log("field clicked", $event.id);
       // const obj = await this.scriptsService.getScriptByKey($event.id);
        // let callback = async (data) => {
        //     if (data) {
        //         // instead of reload
        //         this.GenericList.dataSource = this.listDataSource;
        //     }
        // }
        // this.dialogService.openDialog(this.translate.instant("Edit Script"), ScriptEditorFormComponent, [], { data: obj }, callback);
    }

  getDataSource(): IPepGenericListDataSource {
    return {
      init: async(parameters: IPepGenericListParams) => {
        // call BE api to get the list of items and assign to this.items = 
        // Steps.Congifuration
        console.log('this.currentConfiguration', this.currentConfiguration)
        this.items = [
        ]
        return Promise.resolve({
          dataView: {
            Context: {
              Name: '',
              Profile: { InternalID: 0 },
              ScreenSize: 'Landscape'
            },
            Type: 'Grid',
            Title: 'Resource list',
            Fields: [
              {
                FieldID: 'Resource',
                Type: 'TextBox',
                Title: 'Resource',
                Mandatory: false,
                ReadOnly: true
              },
              {
                FieldID: 'Fields',
                Type: 'TextBox',
                Title: 'Fields',
                Mandatory: false,
                ReadOnly: true
              },
              {
                FieldID: 'Destination',
                Type: 'TextBox',
                Title: 'Destination',
                Mandatory: false,
                ReadOnly: true
              }
            ],
            Columns: [
              {
                Width: 10
              },
              {
                Width: 10
              },
              {
                Width: 10
              }
            ],
            FrozenColumnsCount: 0,
            MinimumColumnWidth: 0
          },
          items: this.items,
          totalCount: this.items.length
        });
      },
      inputs: {
        pager: {
            type: 'scroll'
        },
        selectionType: 'single'
      },
    }
  }

  listActions : IPepGenericListActions = {
    get: async (selectedData: PepSelectionData) => {
        let actions  = [];
        if (selectedData.selectionType == 1)
        {
            if (selectedData.rows.length === 1)
            {
                actions.push({
                    title: this.translate.instant("Edit"),
                    handler: async (selectedData) => {
                      console.log('Edit selected called with item key', selectedData);
                        // let obj = this.paramsVec.find(elem => elem.Name == selectedData.rows[0]);                        
                        // let callback = async (data) => {
                        //     if (data) {
                        //       this.updateParamList(data);
                        //     }
                        // }
                        // this.dialogService.openDialog(this.translate.instant("Edit Parameter"), ScriptParamFormComponent, [], { data: obj }, callback);
                    }
                });
                actions.push({
                    title: this.translate.instant("Delete"),
                    handler: async (selectedData) => {
                      console.log('Delete selected called with item key', selectedData);
                        // this.dialogService.openCancelContinueDialog(this.translate.instant("delete_title") , this.translate.instant("delete_confirm"), async (res)=>{
                        //     if (res)
                        //     {
                        //         this.deleteFromParamList(selectedData.rows,selectedData.selectionType);
                        //     }
                        // });
                    }
                });
            }
        }
        return actions;   
    }   
  }

  addResource()
    {

      console.log('AddResources function called')
        // let callback = async (data) => {
        //     if (data) {
        //         // instead of reload
        //         this.GenericList.dataSource = this.listDataSource;
        //         this.dialogService.openOKDialog(this.translate.instant("add_title"), this.translate.instant("script_added"), async ()=>{});
        //     }
        // }
        
        // this.dialogService.openDialog(this.translate.instant("Add Script"), ScriptEditorFormComponent, [], { data: {} }, callback);
    }

}
