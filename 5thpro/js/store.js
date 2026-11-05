const CART_KEY = "aster-cart";
export function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } }
export function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); window.dispatchEvent(new CustomEvent("cart-updated")); }
export function addToCart(product, quantity = 1) { const cart = getCart(); const item = cart.find((entry) => entry.id === product.id); if (item) item.quantity += quantity; else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity }); saveCart(cart); }
export function removeFromCart(id) { saveCart(getCart().filter((item) => item.id !== id)); }
export function cartCount() { return getCart().reduce((total, item) => total + item.quantity, 0); }
export function money(value) { return `$${value.toLocaleString("en-US")}`; }
