import re
import json
import datetime

def parse_date(date_str):
    # "January 3, 2026 at 11:30 pm"
    # "March 5, 2024 at 6:22 am"
    try:
        dt = datetime.datetime.strptime(date_str.split(" at ")[0], "%B %d, %Y")
        return dt.strftime("%Y-%m-%d")
    except Exception as e:
        return date_str

def parse_deodap_files():
    files = ["deodap_data.txt", "deodap_data_2.txt", "deodap_data_3.txt"]
    all_content = ""
    for f in files:
        try:
            with open(f, "r", encoding="utf-8") as file:
                all_content += "\n" + file.read()
        except FileNotFoundError:
            print(f"File {f} not found, skipping.")

    orders = []
    # Split by order separator or "Order #"
    # The files usually have "Order #..." repeated.

    # Let's find all order blocks.
    # Pattern: Order #ID ... (content) ... until next Order #ID or End

    lines = all_content.splitlines()
    current_order = None
    purchases = []

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        if line.startswith("Order #U"):
            if i+1 < len(lines) and lines[i+1].strip().startswith("Placed on"):
                order_id = line.split(" ")[1]
                date_str = lines[i+1].strip().replace("Placed on ", "")
                date = parse_date(date_str)
                current_order = {"id": order_id, "date": date}
                i += 2
                continue

            if i+1 < len(lines) and lines[i+1].strip().startswith("Product"):
                 i += 2
                 continue

        if not current_order:
            i += 1
            continue

        if line.startswith("SKU:"):
            sku = line.replace("SKU: ", "")

            # Look back for name
            name = ""
            k = i - 1
            while k >= 0:
                if lines[k].strip() != "" and not lines[k].strip().startswith("Order #") and "Fulfilled" not in lines[k]:
                     name = lines[k].strip()
                     break
                k -= 1

            # Look forward for price
            price_line_index = -1
            j = i + 1
            while j < min(i + 15, len(lines)):
                if "Rs." in lines[j] and "\t" in lines[j]:
                    price_line_index = j
                    break
                j += 1

            if price_line_index != -1:
                try:
                    price_parts = lines[price_line_index].strip().split("\t")
                    price = float(price_parts[0].replace("Rs. ", "").replace(",", ""))
                    qty = int(price_parts[1])

                    # Categorize based on name
                    category = "home" # Default
                    lower_name = name.lower()
                    if any(x in lower_name for x in ["cable", "usb", "drive", "earphone", "headphone", "mouse", "keyboard", "bulb", "fan", "charger", "otg", "tripod", "camera", "lens", "screen protector", "game", "controller", "vr box", "speaker", "bluetooth", "watch", "clock"]):
                        category = "electronics"
                    elif any(x in lower_name for x in ["shirt", "pant", "shoe", "sock", "glove", "mask", "slipper", "wear", "cloth", "raincoat"]):
                        category = "clothing"
                    elif any(x in lower_name for x in ["food", "snack", "chocolate", "biscuit", "cookie", "tea", "coffee", "juice", "fruit", "vegetable"]):
                        category = "food"
                    elif any(x in lower_name for x in ["book", "pen", "pencil", "sticker", "notebook", "paper", "ruler", "scissor"]):
                        category = "books"
                    elif any(x in lower_name for x in ["toy", "game", "puzzle", "magic", "doll", "figure"]):
                        if "electronics" not in category:
                            category = "other"

                    if "toy" in lower_name or "magic" in lower_name or "puzzle" in lower_name:
                            category = "other"

                    if any(x in lower_name for x in ["bag", "wallet", "keychain", "ring", "bracelet", "watch", "band"]):
                        category = "accessories"

                    purchase = {
                        "id": f"deodap-{current_order['date']}-{sku.split('_')[0]}",
                        "name": name,
                        "category": category,
                        "price": price,
                        "status": "delivered",
                        "date": current_order["date"],
                        "platform": "deodap",
                        "qty": qty
                    }

                    # Handle deduplication
                    dupe_count = 0
                    original_id = purchase["id"]
                    while any(p['id'] == purchase['id'] for p in purchases):
                            dupe_count += 1
                            purchase['id'] = f"{original_id}-{dupe_count}"

                    # Expand quantity
                    for _ in range(qty):
                        p_copy = purchase.copy()
                        if qty > 1:
                            # Generate unique ID for each unit if q > 1
                             dupe_count_unit = 0
                             base_id = p_copy["id"]
                             while any(p['id'] == p_copy['id'] for p in purchases):
                                 dupe_count_unit += 1
                                 p_copy['id'] = f"{base_id}-{dupe_count_unit}"

                        purchases.append(p_copy)

                except Exception as e:
                    # print(f"Error parsing product at line {i}: {e}")
                    pass

                i = price_line_index + 1
            else:
                i += 1
        else:
            i += 1

    # Generate TypeScript output
    ts_output = """import { Purchase } from '../purchases';

export const DEODAP_PURCHASES: Purchase[] = [
"""
    for p in purchases:
        # Sanitize name
        clean_name = p['name'].replace("'", "\\'")
        # TS Object
        ts_output += f"    {{ id: '{p['id']}', name: '{clean_name}', category: '{p['category']}', price: {p['price']}, status: 'delivered', date: '{p['date']}', platform: 'deodap' }},\n"

    ts_output += "];\n\nexport default DEODAP_PURCHASES;"

    with open("src/data/purchases/deodap.ts", "w", encoding="utf-8") as f:
        f.write(ts_output)

    print(f"Generated {len(purchases)} purchases in src/data/purchases/deodap.ts")

if __name__ == "__main__":
    parse_deodap_files()
