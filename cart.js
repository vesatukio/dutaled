let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateQty(productId, change) {
    let item = cart.find(p => p.id === productId);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) cart = cart.filter(p => p.id !== productId);
    } else if (change > 0) {
        cart.push({id: productId, qty: 1});
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateUI();
}
