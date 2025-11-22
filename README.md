# Adzie - Billboard Marketplace Platform

<div align="center">
  
**Connect Billboard Owners with Advertisers**

A modern, beautiful mobile application built with React Native (Expo) that revolutionizes billboard advertising through a seamless marketplace experience.

[![Made with Expo](https://img.shields.io/badge/Made%20with-Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat&logo=redux&logoColor=white)](https://redux.js.org/)

</div>

---

## 📱 About Adzie

Adzie is a comprehensive billboard marketplace platform that bridges the gap between billboard owners and advertisers. With a stunning purple-themed UI, custom branding, and intuitive design, Adzie makes outdoor advertising accessible, efficient, and profitable for everyone.

## 🎯 How Adzie Helps

### 💼 For Billboard Owners

**Maximize Your Billboard Revenue & Reach**

- **📊 Analytics Dashboard** - Track performance metrics, views, bookings, and revenue in real-time
- **📝 Easy Listing Management** - Create and manage billboard listings with detailed information, pricing, and availability
- **💰 Revenue Optimization** - Set competitive prices, track earnings, and manage booking calendars
- **🎯 Targeted Exposure** - Reach thousands of potential advertisers actively searching for billboard space
- **📈 Performance Insights** - Understand which billboards perform best and optimize your inventory
- **⚡ Quick Bookings** - Automated booking system reduces time from inquiry to confirmed reservation
- **🔒 Secure Transactions** - Built-in payment processing ensures timely and secure payments

**Key Benefits:**
- Reduce vacancy rates by connecting with advertisers 24/7
- Eliminate middlemen and maximize profit margins
- Professional presentation of your billboard inventory
- Data-driven insights to improve billboard positioning and pricing

### 🎨 For Advertisers

**Find the Perfect Billboard for Your Campaign**

- **🗺️ Interactive Map Search** - Browse available billboards on an interactive map with real-time availability
- **🔍 Smart Filters** - Find exact matches using filters for location, price, size, type, and more
- **📸 Visual Gallery** - View high-quality images of each billboard from multiple angles
- **💡 Detailed Specifications** - Get complete information: dimensions, daily impressions, demographics, lighting
- **📱 Mobile Booking** - Book billboards instantly from your phone, anytime, anywhere
- **📅 Booking Management** - Track all your campaigns, bookings, and creative uploads in one place
- **⭐ Reviews & Ratings** - Make informed decisions based on previous advertiser experiences
- **💵 Transparent Pricing** - See exact costs upfront with no hidden fees

**Key Benefits:**
- Access to diverse billboard inventory across multiple locations
- Save time with instant booking and digital contract management
- Better ROI through data-driven location selection
- Direct communication with billboard owners
- Flexible booking periods from days to months

---

## ✨ Key Features

### 🎨 Modern UI/UX
- **Custom Branding** - Beautiful "adzie" logo using Poppins ExtraBold & Bold fonts
- **Purple Theme** - Sophisticated gradient purple design (#7C3AED)
- **Glassmorphism** - Modern card-based design with shadows and rounded corners
- **Smooth Animations** - Delightful micro-interactions throughout the app
- **Icon-Enhanced Inputs** - Visual clarity with Material Community Icons
- **Responsive Design** - Optimized for all mobile screen sizes

### 🔐 Authentication & User Management
- **Dual Role System** - Separate experiences for Advertisers and Billboard Owners
- **Secure Login/Signup** - Email and password authentication with validation
- **Profile Management** - Update personal information and settings
- **Demo Credentials** - Quick access buttons for testing both user types

### 🗺️ Billboard Discovery (Advertisers)
- **Map View** - Interactive map showing billboard locations with custom markers
- **Search & Filter** - Filter by price range, billboard type, size, and location
- **List View** - Card-based listing view with key information
- **Detail Pages** - Comprehensive billboard information with image galleries
- **Ratings & Reviews** - See what other advertisers say

### 📊 Billboard Management (Owners)
- **Dashboard Analytics** - Total listings, views, active bookings, revenue metrics
- **My Listings** - Manage all your billboards in one place
- **Add/Edit Listings** - Full-featured form for creating billboard listings
- **Booking Management** - Track and manage booking requests
- **Performance Tracking** - Monitor which billboards perform best

### 📅 Booking System
- **Instant Booking** - Book billboards with a few taps
- **Booking History** - Track all past and current bookings
- **Creative Upload** - Upload campaign creatives for approval
- **Proof of Display** - View proof images from billboard owners
- **Status Tracking** - Real-time booking status updates

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native (Expo SDK 51+)
- **Language**: TypeScript
- **Navigation**: React Navigation 6 (Stack & Tab Navigation)
- **State Management**: Redux Toolkit
- **Maps**: react-native-maps
- **Icons**: @expo/vector-icons (Material Community Icons)
- **Fonts**: Custom fonts (Poppins ExtraBold, Poppins Bold)
- **Gradients**: expo-linear-gradient

### Backend (Mock Services)
- **Data Storage**: AsyncStorage
- **Mock APIs**: Simulated REST API services
- **Authentication**: JWT-ready mock service
- **Ready for**: Java Spring Boot backend + PostgreSQL

### Development Tools
- **Build Tool**: Expo
- **Type Checking**: TypeScript strict mode
- **Code Quality**: ESLint + Prettier
- **Version Control**: Git

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (will be installed with project)
- **iOS Simulator** (Mac only) or **Android Emulator**
- **Expo Go app** (for physical device testing)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd "c:\Users\azala\repository\New folder\BillboardMarketplace"
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- React Native (Expo)
- React Navigation
- Redux Toolkit
- Custom fonts
- Maps integration
- All other dependencies

### 3. Start the Development Server

```bash
npx expo start
```

### 4. Run the App

Choose one of the following:

**Option 1: Expo Go (Easiest)**
- Install Expo Go app on your phone
- Scan the QR code shown in terminal

**Option 2: iOS Simulator (Mac only)**
- Press `i` in the terminal

**Option 3: Android Emulator**
- Press `a` in the terminal

**Option 4: Web Browser**
- Press `w` in the terminal

---

## 🧪 Demo Credentials

### Billboard Owner Account
```
Email: owner@example.com
Password: password123
```
**Features to Test:**
- Owner dashboard with analytics
- Create new billboard listings
- View and manage existing listings
- Track booking requests

### Advertiser Account
```
Email: advertiser@example.com
Password: password123
```
**Features to Test:**
- Browse billboards on map
- Filter and search listings
- View detailed billboard information
- Make bookings
- View booking history

---

## 📁 Project Structure

```
BillboardMarketplace/
├── assets/
│   ├── fonts/                  # Custom fonts (Poppins)
│   └── images/                 # App assets
├── src/
│   ├── components/             # Reusable components
│   │   └── Logo.tsx           # Custom Adzie logo component
│   ├── navigation/             # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   ├── auth/              # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignupScreen.tsx
│   │   ├── advertiser/        # Advertiser flow
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── MapSearchScreen.tsx
│   │   │   ├── BillboardDetailScreen.tsx
│   │   │   └── BookingsScreen.tsx
│   │   ├── owner/             # Owner flow
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── MyListingsScreen.tsx
│   │   │   └── AddListingScreen.tsx
│   │   └── common/            # Shared screens
│   │       └── ProfileScreen.tsx
│   ├── services/              # Mock backend services
│   │   ├── authService.ts
│   │   ├── billboardService.ts
│   │   └── bookingService.ts
│   ├── store/                 # Redux state management
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   └── billboardSlice.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   ├── types/                 # TypeScript definitions
│   │   └── index.ts
│   └── theme/                 # Theme configuration
│       └── index.ts
├── App.tsx                    # Root component
├── app.json                   # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎨 Customization

### Theme Colors

Edit `src/theme/index.ts` to customize:

```typescript
colors: {
  primary: '#7C3AED',        // Purple
  secondary: '#10B981',      // Green
  background: '#FFFFFF',
  surface: '#F8F9FA',
  // ... more colors
}
```

### Custom Fonts

Fonts are loaded in `App.tsx`:
- **Poppins-ExtraBold**: Main brand font
- **Poppins-Bold**: Secondary brand font

Add more fonts in `assets/fonts/` and update `App.tsx`.

### Logo

The logo component (`src/components/Logo.tsx`) displays "adzie" using:
- "ad" - Poppins Bold
- "zie" - Poppins ExtraBold

---

## 🔧 Development

### Mock Services

The app uses mock services that simulate API responses:

**Benefits:**
- ✅ Develop without backend
- ✅ Fast iteration
- ✅ Realistic data structure
- ✅ Ready for real API integration

**Location:** `src/services/`

### Connecting Real Backend

When your backend is ready:

1. **Install axios:**
```bash
npm install axios
```

2. **Create API client:**
```typescript
// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.adzie.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

3. **Update services:**
```typescript
// Replace mock calls with real API calls
const billboards = await apiClient.get('/billboards');
```

---

## 🐛 Troubleshooting

### Clear Cache

```bash
npx expo start -c
```

### Reset Everything

```bash
rm -rf node_modules
npm install
npx expo start -c
```

### Module Not Found

```bash
npm install
```

### Font Loading Issues

Ensure fonts are in `assets/fonts/` and loaded in `App.tsx`

---

## 🔮 Roadmap

### Phase 1: MVP ✅
- [x] Authentication system
- [x] Billboard browsing
- [x] Owner dashboard
- [x] Basic booking flow
- [x] Modern UI design

### Phase 2: Backend Integration
- [ ] Java Spring Boot API
- [ ] PostgreSQL database
- [ ] JWT authentication
- [ ] Real-time updates
- [ ] File upload (S3)

### Phase 3: Advanced Features
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Push notifications
- [ ] In-app messaging
- [ ] Advanced analytics
- [ ] Campaign scheduling
- [ ] A/B testing for creatives

### Phase 4: Scale
- [ ] Multi-city support
- [ ] Multiple languages
- [ ] Web dashboard
- [ ] API for third-party integrations

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 🤝 Contributing

This is a private project. For questions or collaboration:
- Contact: [Your Contact Info]
- Domain: adzie.com

---

## 💡 Notes

- Currently uses mock data for development
- All coordinates and locations are sample data
- Images are loaded from local assets
- Payment integration is planned for Phase 2
- Backend API structure is defined and ready for integration

---

<div align="center">

**Built with ❤️ using React Native + Expo**

[Visit Adzie](https://adzie.com) • [Documentation](#) • [Support](#)

</div>
