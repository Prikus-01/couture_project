# StoreAdmin - Inventory Management Portal

A modern, responsive web application for managing and browsing product inventory. Built with React, TypeScript, and Tailwind CSS.

## Features

### 1. Welcome Home Page
- Welcome screen with application overview
- Direct navigation to Inventory Overview and Catalogue Overview
- Feature highlights and instructions for new users

### 2. Inventory Overview Screen
- **Comprehensive Product Table**: View products with Name, Price, Brand, Category, Stock Status, and Rating
- **Sorting**: Sort products by Name or Price (ascending/descending)
- **Category Filtering**: Filter products by specific categories
- **Search Functionality**: Real-time search with 300ms debounce for responsive performance
- **Large Data Handling**: Loads 100 products initially, optimized for performance
- **Stock Status Indicators**: Visual indicators for In Stock, Low Stock, and Out of Stock

### 3. Product Details Screen
- **Detailed Product View**: Complete product information with high-quality images
- **Image Gallery**: Multiple product images with thumbnail navigation
- **Extended Details**: Description, Rating, Discount Percentage, Stock information
- **Browse Similar Products**: Related products from the same category displayed as visual cards
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 4. Catalogue Overview Screen
- **Category Cards**: Visual representation of all product categories with preview images
- **Drill-Down Navigation**: Click on a category to view all products in that category
- **Reusable Interface**: Uses the same Inventory Overview interface for consistent UX
- **Category Preview**: Sample product image from each category for visual reference

## Tech Stack

- **Framework**: React 19.2.0 with TypeScript
- **Routing**: React Router DOM 7.11.0
- **Styling**: Tailwind CSS 4.1.18
- **State Management**: React Hooks (Context/Redux available but not required for this implementation)
- **Build Tool**: Vite
- **API**: DummyJSON Products API (https://dummyjson.com/products)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorMessage.tsx
│   ├── LoadingSpinner.tsx
│   ├── Navbar.tsx
│   └── ProductCard.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── InventoryOverview.tsx
│   ├── ProductDetails.tsx
│   └── CatalogueOverview.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main app component with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Assumptions and Design Decisions

### 1. API Integration
- **Assumption**: The DummyJSON API is reliable and accessible. Error handling is implemented for network failures and API errors.
- **Decision**: All API calls use async/await with proper error handling. The API service layer is centralized for easy maintenance.

### 2. Data Loading
- **Assumption**: Loading 100 products initially provides a good balance between performance and data visibility. The requirement states "minimum of 20 products" - we load more for better UX.
- **Decision**: Products are loaded in batches of 100. Pagination could be added in future iterations if needed.

### 3. Search Functionality
- **Assumption**: Users type at a moderate speed. The 300ms debounce provides a good balance between responsiveness and API call efficiency.
- **Decision**: Search is debounced to prevent excessive API calls while maintaining a responsive feel.

### 4. Category Filtering
- **Assumption**: Category filtering and search are mutually exclusive in the user's workflow. When a user selects a category, search is cleared and vice versa.
- **Decision**: Category filter and search work independently but reset each other for clarity.

### 5. Similar Products
- **Assumption**: "Similar products" means products from the same category. We exclude the current product and limit to 6 products as specified.
- **Decision**: Uses the category-based API endpoint with a limit of 7, then filters out the current product to ensure 6 results.

### 6. Responsive Design
- **Assumption**: Users will access the application from various devices (desktop, tablet, mobile).
- **Decision**: Used Tailwind CSS responsive utilities (sm:, md:, lg:) throughout. Mobile-first approach with breakpoints at 640px, 768px, and 1024px.

### 7. Stock Status
- **Assumption**: Stock status thresholds are:
  - Out of Stock: 0 units
  - Low Stock: < 10 units
  - In Stock: >= 10 units
- **Decision**: Color-coded badges for quick visual identification (red for out of stock, yellow for low stock, green for in stock).

### 8. Navigation
- **Assumption**: Users prefer URL-based navigation for bookmarking and sharing.
- **Decision**: React Router is used with URL parameters for category filtering, allowing users to bookmark specific views.

### 9. Loading States
- **Assumption**: Users need clear feedback when data is being fetched.
- **Decision**: Loading spinners and skeleton states are used. Error messages include retry functionality.

### 10. Image Handling
- **Assumption**: Product images from the API are available and loadable. Fallback handling is minimal but could be enhanced.
- **Decision**: Images use the thumbnail for listings and full images for detail views. Image gallery allows browsing multiple product images.

---

## Non-functional Requirements & Assumptions 🔧

Below are the non-functional requirements you provided, how the app addresses them, and the assumptions we make when submitting this assignment.

### Network Transparency ✅
- **Assumption**: Network connectivity may be intermittent or slow for some users.
- **Implementation**: All data fetches display clear loading states (skeleton loaders) via `LoadingSpinner` and `ProductCard` placeholders. Failures surface an `ErrorMessage` component with a helpful message and a retry action.
- **Reasoning**: This avoids blank screens and gives users actionable feedback, improving perceived reliability.

### Device Agnostic (Responsive) 📱🖥️
- **Assumption**: Users will access the app on a wide 1080p monitor, tablets (iPad-like), and mobile phones.
- **Implementation**: Tailwind CSS responsive utilities and a mobile-first layout ensure consistent spacing and legible UI across breakpoints. The `ProductCard` and layout components adapt columns and image sizes accordingly.
- **Reasoning**: Using Tailwind's design system ensures consistent spacing and predictable behavior across common device widths.

### Brand Identity 🎨
- **Assumption**: The app should use a cohesive, limited color palette and typography to avoid a "patchwork" look.
- **Implementation**: A central color palette is defined in `tailwind.config.js` (`primary`, `dark`, `neutral`) and a consistent `fontFamily` is applied across the app.
- **Reasoning**: Centralized theme tokens make it simple to ensure consistency and to update brand colors globally if required.

### Performance & Loading Speed ⚡
- **Assumption**: The app must feel fast even on slower connections; initial UX should be responsive.
- **Implementation**: Data is fetched in controlled batches (100 items), search is debounced (300ms), and images use thumbnails in list views to reduce payload. Images are lazily loaded with an IntersectionObserver-based `LazyImage` component that provides skeleton placeholders and error fallbacks to improve perceived performance and network transparency. Components are modular to enable additional lazy-loading and code-splitting if the app scales.
- **Reasoning**: These measures reduce blocking operations and perceived latency, improving overall UX.

### Code Quality & Modularity 🧩
- **Assumption**: The codebase should be easy to extend and maintain by future contributors.
- **Implementation**: Reusable UI components (in `src/components/`), a centralized API service (`src/services/api.ts`), and TypeScript types (`src/types/`) enforce contracts and prevent common bugs.
- **Reasoning**: Clear separations of concern and typed interfaces accelerate onboarding and lower long-term maintenance costs.

---

## Submission Assumptions (to include with the assignment) ✅

When submitting this assignment, please include the following explicit assumptions so reviewers have proper context:

- **API availability:** The DummyJSON Products API is reachable and returns product data. If the API is unavailable, the app surfaces an error and retry option.
  - *Reasoning*: This project is a frontend-focused exercise; a reliable read-only API simplifies verification.

- **Read-only scope:** No write/CRUD operations (create/update/delete) are required for the assignment.
  - *Reasoning*: This keeps the scope focused on data presentation, filtering, and responsiveness.

- **Images:** Product images are available from the API; if any image fails to load, a visual placeholder is shown.
  - *Reasoning*: Placeholder images maintain layout integrity during network failures.

- **No Authentication Needed:** The app does not include user authentication for this submission.
  - *Reasoning*: Authentication is out-of-scope and would introduce backend dependencies.

- **Browser Support:** The app targets modern evergreen browsers (latest Chrome, Firefox, Edge, Safari).
  - *Reasoning*: Tailwind and modern React features assume a modern browser environment.

- **Node & Tooling:** Node.js v16+ and npm/yarn are available for running the dev server and building the project.
  - *Reasoning*: Vite and the toolchain require a recent Node runtime.

- **Performance Baseline:** The app should perform acceptably for datasets up to a few thousand items; pagination or server-side solutions are recommended beyond that.
  - *Reasoning*: Frontend-only approaches have practical limits; server-side pagination or virtualization would be the next step for larger datasets.

- **Accessibility (Baseline):** Basic accessibility is considered (semantic HTML, focus states), but a full accessibility audit is outside the scope.
  - *Reasoning*: Ensures reasonable default accessibility without diverting scope from core features.

---

If you'd like, I can also add a short checklist at the top of the README for reviewers to validate these assumptions during assessment (✅ Network checks, ✅ Device checks, ✅ Color/Tokens, etc.). Would you like that added?