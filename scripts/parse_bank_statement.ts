import fs from 'fs';
import path from 'path';
import { Transaction } from '../src/data/finance/types';

function parseLine(line: string): Transaction | null {
    // Example format:
    // 23-04-2023 Kotak Mahindra Bank - XX 5999 Money Transfer Personal Transfer UPI/NEERU WO VIKAS /311322337297/Sent from Paytm S20670355 Rs. 1.0
    // Note: The structure is complex and varies.
    // Heuristic:
    // Date: DD-MM-YYYY (start)
    // Bank: Kotak Mahindra... (next)
    // Category: Money Transfer (next)
    // Subcategory: Personal Transfer (next)
    // Narration: UPI/... (middle)
    // Txn ID: S... (before last amount)
    // Amount: Rs. ... (last part, sometimes Credit/Debit column header issues)

    // Simple regex for date specific to this format
    const dateMatch = line.match(/^(\d{2}-\d{2}-\d{4})/);
    if (!dateMatch) return null;
    const date = dateMatch[1];

    // Split by spaces but keep some structure
    // Since columns are fixed width in original PDF but flow here, we rely on keywords and patterns

    // Extract Amount (last part "Rs. 123.45" or similar)
    const amountMatch = line.match(/Rs\.\s*([\d,]+(\.\d+)?)$/);
    if (!amountMatch) return null;
    const amountStr = amountMatch[1].replace(/,/g, '');
    const amount = parseFloat(amountStr);

    // Extract Txn ID (usually starts with S, N, or M followed by digits, before Amount)
    // e.g. S20670355
    const txnIdMatch = line.match(/([A-Z]\d+)\s+Rs\./);
    const txnId = txnIdMatch ? txnIdMatch[1] : '';

    // Bank Name (usually constant here)
    const bankName = "Kotak Mahindra Bank - XX 5999";
    // Note: In reality, we should extract it, but it's hard without fixed width.
    // The text typically has "Kotak Mahindra Bank - XX 5999"

    // Type: The header says "Credit Debit".
    // We need to determine if it's credit or debit.
    // The text format provided doesn't explicitly say "Cr" or "Dr" on the line easily.
    // However, "Money Transfer" usually means Debit if it's "Personal Transfer".
    // "Refund" is Credit.
    // "Wallet Topup" is Debit.
    // "Shopping" is Debit.
    // "Bank Charges" is Debit.
    // let's assume Debit unless we see keywords for Credit.
    let type: 'credit' | 'debit' = 'debit';

    // Prioritize explicit markers in the line
    if (line.includes('/CR/') || line.includes('(CR)') || line.includes(' CR ')) {
        type = 'credit';
    } else if (line.includes('/DR/') || line.includes('(DR)') || line.includes(' DR ')) {
        type = 'debit';
    } else {
        // Fallback heuristics if no explicit marker
        if (line.includes('Refund') ||
            line.includes('Investment Income') ||
            line.includes('Payment from') ||
            line.includes('Received from') ||
            line.includes('REV:IMPS') || // Reversal
            line.includes('CreditAdj')   // Credit Adjustment
        ) {
            type = 'credit';
        } else {
            type = 'debit'; // Default to debit (Money Transfer, Shopping, etc.)
        }
    }

    // Category and Subcategory
    // We can try to match known categories
    let category = "Unknown";
    let subcategory = "Unknown";

    const categories = [
        "Money Transfer", "Shopping", "Wallet Topup", "Bank Charges", "Refund", "Investment Income", "Self Transfer"
    ];

    for (const cat of categories) {
        if (line.includes(cat)) {
            category = cat;
            // Subcategory often follows category
            // e.g. Money Transfer Personal Transfer
            // e.g. Shopping Card Purchase
            // e.g. Wallet Topup Wallet Topup
            const subRegex = new RegExp(`${cat}\\s+([A-Za-z\\s]+?)\\s+(UPI|PCI|NEFT|IMPS|ATM|POS|eCOM|NA)`);
            const subMatch = line.match(subRegex);
            if (subMatch) {
                subcategory = subMatch[1];
            } else {
                if (cat === "Shopping") subcategory = "Online Shopping";
                else if (cat === "Wallet Topup") subcategory = "Wallet Topup";
                else if (cat === "Refund") subcategory = "Refund";
                else if (cat === "Bank Charges") subcategory = "Bank Charges";
            }
            break;
        }
    }

    // Narration
    // Everything else ideally.
    // heuristic: from Subcategory end (or Category) to TxnID
    // Let's grab the part between Bank Name and Rs.
    // Removing metadata we found
    let narration = line;
    narration = narration.replace(date, '').replace(bankName, '').replace(/Rs\.\s*[\d,]+(\.\d+)?/, '').replace(txnId, '').trim();
    // Clean up category/subcategory from narration if possible
    if (category !== "Unknown") narration = narration.replace(category, '');
    if (subcategory !== "Unknown") narration = narration.replace(subcategory, '');
    narration = narration.replace(/\s+/g, ' ').trim();

    return {
        date,
        bankName,
        accountNumber: "5999",
        category,
        subcategory,
        narration,
        txnId,
        amount,
        type
    };
}


function processBuffer(buffer: string[], transactions: Transaction[]) {
    if (buffer.length === 0) return;

    // Join lines with space, compact multiple spaces
    const fullLine = buffer.join(' ').replace(/\s+/g, ' ').trim();
    if (!fullLine) return;

    const txn = parseLine(fullLine);
    if (txn) {
        transactions.push(txn);
    } else {
        // console.log('Failed to parse:', fullLine);
    }
}

function main() {
    const inputPath = path.join(process.cwd(), 'bank_statement.txt');

    if (!fs.existsSync(inputPath)) {
        console.error('File not found:', inputPath);
        return;
    }

    const input = fs.readFileSync(inputPath, 'utf-8');
    const lines = input.split('\n');

    const transactions: Transaction[] = [];
    let buffer: string[] = [];

    // Pattern to identify the start of a new transaction line: "DD-MM-YYYY "
    const dateStartRegex = /^\d{2}-\d{2}-\d{4}\s+/;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Skip headers if they appear in the middle (e.g. page breaks)
        if (trimmed.startsWith('Date Bank Name') ||
            trimmed.startsWith('Account Details') ||
            trimmed.startsWith('Consolidated Account Summary') ||
            trimmed.startsWith('Bank Name Account') ||
            trimmed.match(/Opening\s+Balance/i)
        ) {
            continue;
        }

        if (dateStartRegex.test(trimmed)) {
            // New transaction starts, process previous buffer
            processBuffer(buffer, transactions);
            buffer = [trimmed];
        } else {
            // Continuation of previous transaction
            buffer.push(trimmed);
        }
    }
    // Process last buffer
    processBuffer(buffer, transactions);

    // Deduplication
    const transactionsByMonth: Record<string, Transaction[]> = {};
    const seenTxnIds = new Set<string>();

    for (const txn of transactions) {
        // If txnId is present, check for duplicates
        if (txn.txnId && seenTxnIds.has(txn.txnId)) {
            // console.log(`Skipping duplicate transaction ID: ${txn.txnId}`);
            continue;
        }
        if (txn.txnId) {
            seenTxnIds.add(txn.txnId);
        }

        // txn.date is DD-MM-YYYY
        const [day, month, year] = txn.date.split('-');
        const key = `${year}-${month}`;

        if (!transactionsByMonth[key]) {
            transactionsByMonth[key] = [];
        }
        transactionsByMonth[key].push(txn);
    }

    // Write monthly files
    const outputDir = path.join(process.cwd(), 'src', 'data', 'finance');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const months = Object.keys(transactionsByMonth).sort();

    for (const month of months) {
        const txns = transactionsByMonth[month];
        const outputPath = path.join(outputDir, `${month}.ts`);
        const fileContent = `import type { Transaction } from './types';

export const TRANSACTIONS: Transaction[] = ${JSON.stringify(txns, null, 4)};

export default TRANSACTIONS;
`;
        fs.writeFileSync(outputPath, fileContent);
        console.log(`Generated ${month}.ts with ${txns.length} transactions.`);
    }

    // Generate index.ts
    const indexContent = `import type { Transaction } from './types';
${months.map(m => `import { TRANSACTIONS as T_${m.replace('-', '_')} } from './${m}';`).join('\n')}

export const ALL_TRANSACTIONS: Transaction[] = [
    ${months.map(m => `...T_${m.replace('-', '_')},`).join('\n    ')}
];

export function getAllTransactions(): Transaction[] {
    return ALL_TRANSACTIONS;
}

export function getTransactionsByMonth(year: number, month: number): Transaction[] {
    const y = year.toString();
    const m = month.toString().padStart(2, '0');
    // This is a dynamic lookup optimization could be done,
    // but for now we filter the big list or we could export a map.
    return ALL_TRANSACTIONS.filter(t => t.date.endsWith(year.toString()) && t.date.substring(3, 5) === m);
}

// --- Analytics Helpers ---

export function getMonthlyStats(year: number) {
    const stats = Array(12).fill(0).map(() => ({ income: 0, expense: 0, savings: 0 }));
    const yStr = year.toString();

    ALL_TRANSACTIONS.forEach(t => {
        if (t.date.endsWith(yStr)) {
            const monthIndex = parseInt(t.date.substring(3, 5)) - 1;
            if (monthIndex >= 0 && monthIndex < 12) {
                if (t.type === 'credit') {
                    stats[monthIndex].income += t.amount;
                } else {
                    stats[monthIndex].expense += t.amount;
                }
            }
        }
    });

    // Calculate savings
    stats.forEach(m => m.savings = m.income - m.expense);
    return stats;
}

export function getCategoryStats(year: number, type: 'credit' | 'debit') {
    const stats: Record<string, number> = {};
    const yStr = year.toString();

    ALL_TRANSACTIONS.forEach(t => {
        if (t.date.endsWith(yStr) && t.type === type) {
            const cat = t.category || 'Unknown';
            stats[cat] = (stats[cat] || 0) + t.amount;
        }
    });

    return stats;
}

export function getYearlyStats() {
    const stats: Record<number, { income: 0, expense: 0, savings: 0 }> = {};

    ALL_TRANSACTIONS.forEach(t => {
        const year = parseInt(t.date.substring(6, 10));
        if (!stats[year]) stats[year] = { income: 0, expense: 0, savings: 0 };

        if (t.type === 'credit') {
            stats[year].income += t.amount;
        } else {
            stats[year].expense += t.amount;
        }
    });

    Object.values(stats).forEach((s: any) => s.savings = s.income - s.expense);
    return stats;
}

export function getFinancialYears(): number[] {
    const years = new Set<number>();
    ALL_TRANSACTIONS.forEach(t => years.add(parseInt(t.date.substring(6, 10))));
    return Array.from(years).sort((a, b) => b - a);
}

`;

    fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
    console.log('Generated index.ts');
}

main();
