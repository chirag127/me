# Deodap Purchase Integration & Refactoring

- [x] Parase Deodap purchase data from user input <!-- id: 0 -->
- [x] Refactor `src/data/purchases.ts` to be modular (split by platform) <!-- id: 1 -->
- [x] Create `src/data/purchases/deodap.ts` with the new data <!-- id: 2 -->
- [x] Create `src/data/purchases/flipkart.ts` and `src/data/purchases/amazon.ts` from existing data <!-- id: 3 -->
- [x] Create `src/data/purchases/index.ts` to aggregate all data <!-- id: 4 -->
- [x] Update `src/apps/me/Purchases.ts` to handle 'deodap' platform and new data structure <!-- id: 5 -->
- [x] Check `src/apps/me/Gear.ts` and update if it uses purchase data <!-- id: 6 -->
- [x] Verify everything works <!-- id: 7 -->
