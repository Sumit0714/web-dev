# 🛍 LUXE Store — React Capstone Project

## Tech Stack (per SOP requirements)
- **Frontend**: React 18 + Vite + JavaScript ES6+
- **State Management**: Redux Toolkit (cartSlice, wishlistSlice, uiSlice)
- **Routing**: React Router v6 (/, /shop, /wishlist, /checkout)
- **API Integration**: Axios → FakeStore API (https://fakestoreapi.com)
- **Styling**: Custom CSS with CSS Variables (Tailwind-compatible)
- **Domain**: E-Commerce

## Advanced Features Implemented (✅ 7 of 10)
1. ✅ **Search + Filter + Sort** — debounced search, category chips, 4 sort modes
2. ✅ **Dark Mode Toggle** — full CSS variable theming
3. ✅ **Debounced API Calls** — 320ms debounce on search input
4. ✅ **Error Boundary** — class component wrapping all routes
5. ✅ **Performance Optimization** — `useMemo`, `memo()` on ProductCard
6. ✅ **Pagination / Infinite Scroll** — skeleton loading states
7. ✅ **Multi-step Form with Validation** — 3-step checkout

## Project Structure
```
luxe-store/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              ← Entry: Provider + BrowserRouter
    ├── App.jsx               ← Routes + layout
    ├── styles/
    │   └── global.css        ← All CSS variables & component styles
    ├── store/
    │   ├── index.js          ← configureStore
    │   ├── cartSlice.js      ← addToCart, removeFromCart, changeQty, clearCart
    │   ├── wishlistSlice.js  ← toggleWishlist
    │   └── uiSlice.js        ← darkMode, toast, cartOpen
    ├── hooks/
    │   ├── useProducts.js    ← Axios fetch from FakeStore API
    │   ├── useDebounce.js    ← Debounce custom hook
    │   └── useToast.js       ← Toast dispatch hook
    ├── components/
    │   ├── Navbar.jsx        ← Sticky nav with search, cart, wishlist, dark mode
    │   ├── ProductCard.jsx   ← Memoized card with add-to-cart & wishlist
    │   ├── SkeletonCard.jsx  ← Loading shimmer
    │   ├── CartDrawer.jsx    ← Slide-in cart with qty controls
    │   ├── Toast.jsx         ← Global notification toast
    │   ├── ErrorBoundary.jsx ← Class component error boundary
    │   └── Footer.jsx
    └── pages/
        ├── Home.jsx          ← Hero + Categories + Featured products
        ├── Shop.jsx          ← All products, filter/sort/search
        ├── Wishlist.jsx      ← Saved items grid
        └── Checkout.jsx      ← 3-step: Delivery → Payment → Review → Confirm
```

## Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# → http://localhost:5173
```

## Build for Production
```bash
npm run build
npm run preview
```

## Deployment
Upload the `dist/` folder to **Vercel** or **Netlify**:
- Vercel: `vercel deploy`
- Netlify: Drag & drop `dist/` folder

## API Used
**FakeStore API** — https://fakestoreapi.com/products
- Free, no authentication required
- Returns 20 real products across 4 categories
- Used with Axios for clean request handling
