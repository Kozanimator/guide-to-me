console.log("TAG-ME script loaded.");

const order = [];
const menu = { Burger: 12, Pizza: 15, Salad: 9, Fries: 5, Drink: 3 };

function add_item_to_order(price) {
    order.push(price);
}

function calculate_total(prices) {
    let total = 0;
    for (const price of prices) {
        console.log(price);
        total += price;
    }
    return total;
}

add_item_to_order(menu["Burger"]);
add_item_to_order(menu["Fries"]);
add_item_to_order(menu["Drink"]);

console.log(order);
console.log("Total: " + calculate_total(order));
