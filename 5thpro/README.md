# Aster & Co. Capstone Storefront

A modular, client-side e-commerce catalog for considered home goods.

## Architecture

- `js/data.js` contains the product catalog.
- `js/store.js` owns cart persistence and pricing helpers.
- `js/components.js` contains reusable page and product renderers.
- `js/app.js` handles hash-based client-side routing and delegated UI events.
- Optimized Unsplash image URLs use `auto=format`, constrained widths, quality settings, and lazy loading for below-the-fold assets.

## Routes

- `#/` — storefront home
- `#/shop` — filterable product catalog
- `#/product/:id` — product detail and add-to-cart
- `#/cart` — persistent shopping bag
- `#/about` and `#/journal` — content pages

The site is static and can be deployed to Vercel, Netlify, Render, or GitHub Pages without a build step.
