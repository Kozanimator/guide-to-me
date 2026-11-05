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

const orderedItems = ["Burger", "Fries", "Drink"];
let receipt = "";

for (const item of orderedItems) {
    const price = menu[item];
    add_item_to_order(price);
    receipt += `<p>${item}: $${price}</p>`;
}

console.log(order);
const totalPrice = calculate_total(order);
console.log("Total: " + totalPrice);

const itemList = document.getElementById("item_list");
const totalCost = document.getElementById("total");

if (itemList && totalCost) {
    itemList.innerHTML = receipt;
    totalCost.textContent = "Total: $" + totalPrice;
}

console.log(order);
console.log("Total: " + calculate_total(order));
