import '@pepperi-addons/cpi-node'
import ActiveTransactionCpiService from './services/active-transaction.service';
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
    })
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
    })
})