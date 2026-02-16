export interface Transaction {
    date: string; // DD-MM-YYYY format in source
    bankName: string;
    accountNumber: string; // Extracted from bank name (e.g. "XX 5999")
    category: string;
    subcategory: string;
    narration: string;
    txnId: string;
    amount: number;
    type: 'credit' | 'debit';
    balance?: number;
}
