import '@pepperi-addons/cpi-node'
import { GetValueOption, SearchDataConifuration } from 'shared';
import ActiveTransactionCpiService from './services/active-transaction.service';
import CreateActivityCpiService from './services/create-activity.service';
import CreateSurveyCpiService from './services/create-survey.service';
import CreateTransactionCpiService from './services/create-transaction.service';
import GetValuesCpiService from './services/get-values.service';
import NavigateToCpiService from './services/navigate-to.service';
import OpenExternalCpiService from './services/open-external.service';
import EditRichTextCpiService from './services/edit-rich-text.service';
import SearchDataCpiService from './services/search-data.service';
import ExtractValueCpiService from './services/extract-value.service';

export async function load(configuration: any): Promise<void>{
    return Promise.resolve();
}

export const router = Router()
router.post('/navigate_to', async (req, res, next) => {
// debugger;
    try {
        if (req.body) {
            const service = new NavigateToCpiService();
            await service.navigateTo(req.body, req.context);
        } else {
            console.log('no body was sent');
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

    res.json({
    });
})

router.post('/get_active_transaction_uuid', async (req, res, next) => {
    const tmpRes = {};
    let transactionUUID = '';
    // debugger;
    try {
        if (req.body) {
            const service = new ActiveTransactionCpiService();
            transactionUUID = await service.getActiveTransactionUUID(req.body, req.context);
        } else {
            console.log('no body was sent');
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

    if (req.body.SaveResultIn) {
        tmpRes[req.body.SaveResultIn] = transactionUUID;
    } else {
        tmpRes['transactionUUID'] = transactionUUID;
    }

    res.json(tmpRes);
})

router.post('/get_values', async (req, res, next) => {
    let values: GetValueOption[] = [];
// debugger;
    try {
        if (req.body) {
            const service = new GetValuesCpiService();
            values = await service.getValues(req.body, req.context);
        } else {
            console.log('no body was sent');
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

    res.json({
        Options: values
    });
})

router.post('/create_transaction_uuid', async (req, res, next) => {
    let transactionUUID = '';
    const tmpRes = {};
// debugger;
    try {
        if (req.body) {
            const service = new CreateTransactionCpiService();
            transactionUUID = await service.createTransactionUUID(req.body, req.context);
        } else {
            console.log('no body was sent');
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

    if (req.body.SaveResultIn) {
        tmpRes[req.body.SaveResultIn] = transactionUUID;
    } else {
        tmpRes['transactionUUID'] = transactionUUID;
    }

    res.json(tmpRes);
})

router.post('/create_activity_uuid', async (req, res, next) => {
    let activityUUID = '';
    const tmpRes = {};
// debugger;
    try {
        if (req.body) {
            const service = new CreateActivityCpiService();
            activityUUID = await service.createActivityUUID(req.body, req.context);
        } else {
            console.log('no body was sent');
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

    if (req.body.SaveResultIn) {
        tmpRes[req.body.SaveResultIn] = activityUUID;
    } else {
        tmpRes['activityUUID'] = activityUUID;
    }

    res.json(tmpRes);
})

router.post('/create_survey_uuid', async (req, res, next) => {
    let surveyUUID = '';
    const tmpRes = {};
// debugger;
    try {
        if (req.body) {
            const service = new CreateSurveyCpiService();
            surveyUUID = await service.createSurveyUUID(req.body, req.context);
        } else {
            console.log('no body was sent');
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

    if (req.body.SaveResultIn) {
        tmpRes[req.body.SaveResultIn] = surveyUUID;
    } else {
        tmpRes['surveyUUID'] = surveyUUID;
    }

    res.json(tmpRes);
})

router.post('/open_external', async (req, res, next) => {
// debugger;
    try {
        if (req.body) {
            const service = new OpenExternalCpiService();
            await service.openExternal(req.body, req.context);
        } else {
            console.log('no body was sent');
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

    res.json({
    });
})

router.post('/edit_rich_text', async (req, res, next) => {
    let result = {}
    try {
        if (req?.body) {
            const service = new EditRichTextCpiService();
            result = await service.findReplaceText(req.body, req.context) ?? {};
        } else {
            console.log('no body was sent');
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

    res.json({
        configuration: result
    });
})

router.post('/extract_value', async (req, res, next) => {
    let result: any = {};
    const tmpRes = {};

    try {
        if (req?.body) {
            const service = new ExtractValueCpiService();
            const body = req?.body ? req.body : {};
            const context = req?.context ? req.context : {};
            result = await service.extraction(body, context);
        } else {
          console.log('no path/source object was sent');
        }
        if (result && Object.keys(result).length > 0 && result['Value'] && req.body.SaveSourceOn) {
            const service = new ExtractValueCpiService();
            tmpRes[req.body.SaveSourceOn.Value] = service.hasValue(result['Value']) ? result['Value'].Value : '';
        } else {
            console.log('no value was retrieve on said path');
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

    res.json(tmpRes);
});

router.post('/search_data', async (req, res, next) => {
    let result: any;
    const tmpRes = {};
// debugger;
    try {
        if (req.body) {
            const service = new SearchDataCpiService();
            result = await service.searchData(req.body, req.context);
        } else {
            console.log('no body was sent');
        }

        if (result && req.body.SaveResultIn) {
            tmpRes[req.body.SaveResultIn] = result;
        }
    } catch (err) {
        console.log(err);
        next(err)
    }

    res.json(tmpRes);
})
