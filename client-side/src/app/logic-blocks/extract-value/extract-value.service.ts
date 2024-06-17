import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  PepHttpService,
  PepSessionService,
} from "@pepperi-addons/ngx-lib";
import { BaseLogicBlockService } from "src/app/shared/services/base-logic-blocks.service";

@Injectable()
export class ExtractValueLogicBlockService extends BaseLogicBlockService {
  constructor(
    translate: TranslateService,
    sessionService: PepSessionService,
    httpService: PepHttpService
  ) {
    super(translate, sessionService, httpService);
  }
}
