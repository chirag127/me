# Deodap Purchase Integration & Refactoring

- [x] Parase Deodap purchase data from user input <!-- id: 0 -->
- [x] Refactor `src/data/purchases.ts` to be modular (split by platform) <!-- id: 1 -->
- [/] Implement Bank Statement Parser `scripts/parse_bank_statement.ts` <!-- id: 2 -->
    - [x] Handle multi-line transactions <!-- id: 3 -->
    - [x] Heuristic categorization <!-- id: 4 -->
    - [x] Monthly file partitioning <!-- id: 5 -->
- [x] Process Data <!-- id: 6 -->
    - [x] Run parser on `bank_statement.txt` <!-- id: 7 -->
    - [x] Verify `src/data/finance/YYYY-MM.ts` generation <!-- id: 8 -->
