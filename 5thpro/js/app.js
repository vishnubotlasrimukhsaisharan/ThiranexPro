import { products } from "./data.js";
import { addToCart, cartCount, getCart, money, removeFromCart } from "./store.js";
import { findProduct, renderCart, renderHome, renderProduct, renderShop } from "./components.js";

const app = document.querySelector("#app");
const nav = document.querySelector("#site-nav");

function updateCartCount() { document.querySelector("#cart-count").textContent = cartCount(); }
function route() {
  const path = location.hash.replace(/^#\/?/, "") || "home";
  const parts = path.split("/");
  if (parts[0] === "shop") app.innerHTML = renderShop(new URLSearchParams(location.hash.split("?")[1]).get("category") || "All");
  else if (parts[0] === "product") {
    const product = findProduct(parts[1]);
    app.innerHTML = product ? renderProduct(product) : `<section class="container empty"><h1>Object not found.</h1><a class="button" href="#/shop" data-route>Back to shop</a></section>`;
  } else if (parts[0] === "cart") app.innerHTML = renderCart(getCart());
  else if (parts[0] === "about") app.innerHTML = `<section class="container about-page"><p class="eyebrow">Our story</p><h1 class="section-title">Good things take<br /><em>a little time.</em></h1><p>We started Aster & Co. with a simple belief: the objects we choose shape the way we experience a day. So we search for makers who care about materials, process, and the quiet joy of making something well.</p></section>`;
  else if (parts[0] === "journal") app.innerHTML = `<section class="container about-page"><p class="eyebrow">The journal</p><h1 class="section-title">Notes on a life<br /><em>well considered.</em></h1><div class="journal-grid"><article class="journal-card"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=75" alt="Desk with notebook and plant" loading="lazy" /><h2>The case for less</h2><p>On choosing fewer things, more intentionally.</p></article><article class="journal-card"><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=75" alt="Quiet living room interior" loading="lazy" /><h2>Make room for ritual</h2><p>Small habits that make a home feel like yours.</p></article></div></section>`;
  else app.innerHTML = renderHome();
  updateCartCount(); app.focus(); window.scrollTo(0, 0); nav.classList.remove("is-open");
}

document.addEventListener("click", (event) => {
  const routeLink = event.target.closest("[data-route]");
  if (routeLink) nav.classList.remove("is-open");
  const addButton = event.target.closest("[data-add]");
  if (addButton) { const product = findProduct(addButton.dataset.add); const quantity = Number(document.querySelector("#quantity")?.textContent || 1); addToCart(product, quantity); addButton.innerHTML = "Added to bag ✓"; setTimeout(() => { addButton.innerHTML = 'Add to bag <span aria-hidden="true">↗</span>'; }, 1600); }
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) { removeFromCart(removeButton.dataset.remove); route(); }
  const category = event.target.closest("[data-category]");
  if (category) { const url = `#/shop?category=${encodeURIComponent(category.dataset.category)}`; history.pushState({}, "", url); route(); }
  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) { const quantity = document.querySelector("#quantity"); quantity.textContent = Math.max(1, Number(quantity.textContent) + Number(quantityButton.dataset.quantity)); }
  if (event.target.closest("[data-checkout]")) window.alert("Thanks! Checkout is ready to connect to your payment provider.");
});
document.querySelector(".menu-toggle").addEventListener("click", () => { const open = nav.classList.toggle("is-open"); document.querySelector(".menu-toggle").setAttribute("aria-expanded", String(open)); });
document.querySelector(".newsletter-form").addEventListener("submit", (event) => { event.preventDefault(); event.currentTarget.innerHTML = "<p>Thank you — you're on the list.</p>"; });
window.addEventListener("hashchange", route); window.addEventListener("popstate", route); window.addEventListener("cart-updated", updateCartCount);
document.querySelector("#year").textContent = new Date().getFullYear(); route();
