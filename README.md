# INOX — Cinema F&B Ordering App

A bare React Native CLI app for browsing and ordering food & beverages, with cart state in Redux and Razorpay test-mode checkout.

## Tech Stack

- React Native 0.86 (bare CLI, no Expo)
- Redux Toolkit + React Redux — cart state
- React Navigation (native stack)
- Reanimated + Gesture Handler
- react-native-vector-icons (Ionicons)
- react-native-razorpay — test-mode payments

## Prerequisites

- Node.js >= 22.11
- JDK 17
- Android Studio with an Android SDK, platform-tools, and an emulator or a physical device
- A Razorpay test key 


## Setup

```sh
npm install
```

## Configuration

Razorpay's test key ID lives in one place:

```
src/constants/paymentConfig.js
```

Replace `RAZORPAY_KEY_ID` with your own test key (`rzp_test_...`) before running.

## Running (Android)

Start Metro in one terminal:

```sh
npm start
```

Build and install the app in another:

```sh
npm run android
```

## Project Structure

```
INOX/
├── android/                     # Native Android project
├── ios/                         # Native iOS project (unverified, see above)
├── App.js                       # Root component: providers + navigation + cart sheet
├── index.js                     # Entry point (AppRegistry)
└── src/
    ├── assets/
    │   └── fnb.json              # Food & beverage catalog
    ├── components/                # Presentational, reusable UI
    │   ├── CartLineItem.js
    │   ├── CategoryTile.js
    │   ├── FilterChip.js
    │   ├── FoodItemCard.js
    │   ├── PaymentSuccessModal.js
    │   ├── QuantityStepper.js
    │   ├── RepeatItemCard.js
    │   └── Toolbar.js
    ├── constants/
    │   ├── categories.js
    │   ├── paymentConfig.js       # Razorpay test key
    │   └── theme.js               # Colors, spacing, typography
    ├── features/
    │   └── cart/
    │       ├── CartBottomSheet.js # Cart UI + Razorpay checkout
    │       └── cartStore.js       # Redux slice (quantities, isCartOpen)
    ├── navigation/
    │   └── AppNavigator.js
    ├── screens/
    │   ├── HomeScreen.js
    │   └── ListingScreen.js
    ├── services/
    │   └── foodService.js         # Reads/normalizes fnb.json
    ├── store/
    │   └── index.js               # Redux store
    └── utils/
        └── filterUtils.js         # Category/food-type filtering
```
