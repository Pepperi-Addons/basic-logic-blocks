import { TranslateService } from "@ngx-translate/core";
import { SchemeFieldType } from "@pepperi-addons/papi-sdk";
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { IPepOption } from "@pepperi-addons/ngx-lib";
import { ExtractValueLogicBlockService } from "./extract-value.service";
import { PepAddonBlockLoaderService } from "@pepperi-addons/ngx-lib/remote-loader";
import { BaseLogicBlockDirective } from "src/app/shared/components/base-logic-block.directive/base-logic-block.directive";
import { ConifurationProperty } from "shared";

export interface ExtractValueConifuration {
  Object: ExtractValueConifurationProperty;
  // SourcePathState: ExtractValueConifurationProperty;
  SourcePath: ExtractValueConifurationProperty;
  SaveSourceOn: ExtractValueConifurationProperty;
  Value: ExtractValueConifurationProperty;
}

export interface ExtractValueConifurationProperty extends ConifurationProperty {
  Type: SchemeFieldType;
}

@Component({
  templateUrl: "./extract-value.component.html",
  styleUrls: ["./extract-value.component.scss"],
  providers: [ExtractValueLogicBlockService],
})
export class ExtractValueLogicBlockComponent extends BaseLogicBlockDirective {
  protected objectFlowParamsOptions: IPepOption[] = [];
  protected allFlowParamsOptions: IPepOption[] = [];

  constructor(
    viewContainerRef: ViewContainerRef,
    translate: TranslateService,
    protected logicBlockService: ExtractValueLogicBlockService,
    public addonBlockService: PepAddonBlockLoaderService
  ) {
    super(viewContainerRef, translate, logicBlockService);
  }

  private loadOptions() {
    this.objectFlowParamsOptions =
      this.logicBlockService.getFlowParametersOptions("Object");
    this.allFlowParamsOptions = this.loadFlowVariableFields();

    console.log(this.currentConfiguration);
  }

  private loadFlowVariableFields() {
    const flowParametersByType = this.logicBlockService.flowParametersByType;
    const fields: IPepOption[] = [];

    Array.from(flowParametersByType.keys()).forEach((fieldType) => {
      const fieldsByType = flowParametersByType.get(fieldType).map((field) => {
        return { key: field.key, value: field.value };
      });
      fields.push(...fieldsByType);
    });

    return fields;
  }

  // Do nothing here the init implementation is in the loadDataOnInit function.
  // ngOnInit(): void { }

  /**************************************************************************************/
  /*                            Override base functions.
    /**************************************************************************************/

  /**************************************************************************************/
  /*                            Implements abstract functions.
    /**************************************************************************************/

  get currentConfiguration(): ExtractValueConifuration {
    return this._currentConfiguration as ExtractValueConifuration;
  }

  protected getTitleResourceKey(): string {
    return "EXTRACT_VALUE.TITLE";
  }

  protected loadDataOnInit(): void {
    //this.createDefaultConfiguration();
    this.loadOptions();
  }

  protected createDefaultConfiguration(): ExtractValueConifuration {
    const config: ExtractValueConifuration = {
      Object: {
        Type: "Object",
        Value: null,
      },
      SourcePath: {
        FlowParamSource: "Static",
        Type: "String",
        Value: null,
      },
      Value: {
        Type: "String",
        Value: null,
      },
      SaveSourceOn: {
        Type: "String",
        Value: null,
      },
    };

    return config;
  }

  protected calculateDoneIsDisabled(): boolean {
    return (
      !this.currentConfiguration.Object.Value ||
      !this.currentConfiguration.SaveSourceOn.Value ||
      !this.currentConfiguration.SourcePath.Value
    );
  }
}
