# Chirp 🐦 — Social Media Web Application

Chirp is a modern, responsive, production-ready React web application built with **Vite**, **TypeScript**, and **Tailwind CSS**. It faithfully implements the Figma layout specifications and fulfills all technical assessment requirements with DummyJSON API integration, infinite scrolling, optimistic updates, interactive theming, and mobile-first responsiveness.

---

## 🚀 Live Demo & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application runs locally at `http://localhost:5173/`.

---

🎨 Visual Design & Styling (Figma Match)

- **Brand & Header Color**: Teal / Emerald `#00B59C` header bar with crisp white text, bird logo, search input, and profile pill.
- **Page Canvas**: Light gray `#f3f4f6` background (with sleek `#0f172a` dark mode equivalent).
- **Cards & Sidebars**: Pure white `#ffffff` (`#1e293b` in dark mode) with `16px / rounded-2xl` border radius and subtle shadows.
- **Accent Buttons**: Rounded teal pills (`#00B59C`) with bold white text (e.g., `Post ➢`).
- **Post Content Boxes**:
  - Distinct rounded light gray **Title Box** (`rounded-xl bg-gray-100 dark:bg-slate-700/50`)
  - Distinct rounded light gray **Context Box** (`rounded-xl bg-gray-50 dark:bg-slate-700/25`)
  - Contextual media containers with zoom-on-hover effects.

---

 ⚡ Core Technical Features

 1. DummyJSON API Integration
- **Posts**: `https://dummyjson.com/posts` (batched with `limit` and `skip`).
- **Users**: `https://dummyjson.com/users` (caching author data to resolve avatars, full names, and @handles).
- **Comments**: `https://dummyjson.com/posts/{id}/comments` (fetched on demand for post detail view).
- **User Posts**: `https://dummyjson.com/posts/user/{userId}` (for individual profile screens).

 2. Mock Auth State
- Default authenticated user: **Emily Johnson** (`id: 1`, `@emilys`, Lead Product Designer at Chirp).
- New chirps and replies automatically originate from this authenticated user.

 3. Smooth Infinite Scroll Feed
- Automated pagination via `IntersectionObserver` on sentinel elements.
- Custom `usePosts` hook managing batch fetching, pagination state, and total counts.
- Shimmering skeleton loader cards during background fetches.
- User-friendly error card with a dedicated **Retry** button and empty-state handlers.

 4. 280-Max Character Post Creation
- "Share What You Are Feeling! 😁" compose widget on desktop right sidebar and mobile FAB modal.
- Real-time character counter (`0/280`) with warning color transitions (green → amber at 240 → red over 280).
- Attachment support (image uploads with instant base64 preview or preset sample assets).
- Optimistic top-of-feed insertion with form reset and floating toast confirmation.

 5. Instant Optimistic Likes & Bookmarks
- Heart like button toggles count and filled state instantly.
- Bookmark button saves posts to a dedicated Bookmarks tab with `localStorage` persistence.

 6. Post Detail View & Interactive Replies
- Clicking any post card opens the full Post Detail screen.
- Fetches real comments from DummyJSON and supports posting instant replies.
- "Back to Feed" navigation preserving state.

 7. User Profile Screen
- Banner header, avatar, handle, role, location, email, and follower counts.
- Displays all chirps authored by that specific user.
- Interactive Follow / Following toggle button.

8. Interactive Light / Dark Mode Toggle
- Built into the left sidebar, mobile slide-out drawer, and header.
- Respects system preferences and persists to `localStorage`.

---

 📱 Responsive Breakpoints

| Breakpoint | Layout Behavior |
| :--- | :--- |
| Desktop (>1024px) | Full 3-column architecture (Left Sidebar + Center Feed + Right Compose & Trending panel) |
| Tablet (768px – 1023px) | Compact icon sidebar with tooltips, center feed expands, quick collapsible compose box |
| Mobile (<767px) | Sidebars hidden, top hamburger opens slide-out drawer with blur backdrop, sticky Floating Action Button (FAB) opens compose modal |

---

## 🛠️ Architecture & Directory Structure

```
chirp/
├── public/
│   └── favicon.svg              # Chirp bird SVG favicon
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx       # App info & architecture summary
│   │   ├── BookmarksView.tsx    # Saved bookmarks view
│   │   ├── ComposeBox.tsx       # "Share What You Are Feeling!" widget
│   │   ├── ErrorMessage.tsx     # Error state card with Retry button
│   │   ├── FeedView.tsx         # Main feed with Following/Suggested tabs & infinite scroll
│   │   ├── Header.tsx           # Teal #00B59C top brand bar
│   │   ├── MessagesView.tsx     # Direct messaging view
│   │   ├── MobileDrawer.tsx     # Slide-out drawer menu
│   │   ├── MobileFab.tsx        # Sticky mobile FAB + compose modal
│   │   ├── NotificationsView.tsx# Activity notifications
│   │   ├── PostCard.tsx         # White rounded post card with title & context boxes
│   │   ├── PostDetail.tsx       # Post discussion screen with replies
│   │   ├── ProfileView.tsx      # User profile view with authored posts
│   │   ├── SettingsModal.tsx    # Preferences & cache reset
│   │   ├── Sidebar.tsx          # Left navigation sidebar & theme switch
│   │   ├── SkeletonLoader.tsx   # Shimmering loading placeholders
│   │   ├── Toast.tsx            # Floating action notification toasts
│   │   └── TrendingWidget.tsx   # Trending topics & who to follow
│   ├── hooks/
│   │   ├── usePosts.ts          # Infinite scroll, pagination, optimistic state
│   │   └── useTheme.ts          # Dark/light mode management
│   ├── services/
│   │   └── api.ts               # DummyJSON API integration & user caching
│   ├── types/
│   │   └── index.ts             # Strict TypeScript interfaces
│   ├── App.tsx                  # Main SPA router and state container
│   ├── index.css                # Tailwind directives & custom animations
│   └── main.tsx                 # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.ts
```
