import { ALL_TRANSACTIONS } from '../src/data/finance/index.js';

let errors = 0;
ALL_TRANSACTIONS.forEach((t, index) => {
    if (!t.date || typeof t.date !== 'string') {
        console.error(`Transaction at index ${index} missing valid date:`, t);
        errors++;
    } else if (t.date.length !== 10) {
        console.error(`Transaction at index ${index} has malformed date ${t.date}`);
        errors++;
    }
    if (typeof t.amount !== 'number' || isNaN(t.amount)) {
        console.error(`Transaction at index ${index} missing valid amount:`, t);
        errors++;
    }
    if (t.type !== 'credit' && t.type !== 'debit') {
        console.error(`Transaction at index ${index} missing valid type:`, t);
        errors++;
    }
});
if (errors === 0) {
    console.log('All transactions are perfectly formatted!');
} else {
    console.log(`Found ${errors} errors in transactions.`);
}
