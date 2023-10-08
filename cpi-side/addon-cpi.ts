import '@pepperi-addons/cpi-node'
import { GetValueOption } from 'shared';
import ActiveTransactionCpiService from './services/active-transaction.service';
import CreateActivityCpiService from './services/create-activity.service';
import CreateTransactionCpiService from './services/create-transaction.service';
import GetValuesCpiService from './services/get-values.service';
import NavigateToCpiService from './services/navigate-to.service';

export async function load(configuration: any): Promise<void>{
    return Promise.resolve();
}

export const router = Router()
router.post('/navigate_to', async (req, res) => {
// debugger;
    if (req.body) {
        const service = new NavigateToCpiService();
        await service.navigateTo(req.body, req.context);
    } else {
        console.log('no body was sent');
    }

    res.json({
    });
})

router.post('/get_active_transaction_uuid', async (req, res) => {
    let transactionUUID = '';
// debugger;
    if (req.body) {
        const service = new ActiveTransactionCpiService();
        transactionUUID = await service.getActiveTransactionUUID(req.body, req.context);
    } else {
        console.log('no body was sent');
    }

    res.json({
        transactionUUID: transactionUUID
    });
})

router.post('/get_values', async (req, res) => {
    let values: GetValueOption[] = [];
// debugger;
    if (req.body) {
        const service = new GetValuesCpiService();
        values = await service.getValues(req.body, req.context);
    } else {
        console.log('no body was sent');
    }

    res.json({
        Options: values
    });
})

router.post('/create_transaction_uuid', async (req, res) => {
    let transactionUUID = '';
// debugger;
    if (req.body) {
        const service = new CreateTransactionCpiService();
        transactionUUID = await service.createTransactionUUID(req.body, req.context);
    } else {
        console.log('no body was sent');
    }

    res.json({
        transactionUUID: transactionUUID
    });
})

router.post('/create_activity_uuid', async (req, res) => {
    let activityUUID = '';
// debugger;
    if (req.body) {
        const service = new CreateActivityCpiService();
        activityUUID = await service.createActivityUUID(req.body, req.context);
    } else {
        console.log('no body was sent');
    }

    res.json({
        activityUUID: activityUUID
    });
})
