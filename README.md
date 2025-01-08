# Aviation Route Management System - Frontend

## Technologies Used

- **React 18** with TypeScript for building the user interface
- **Material UI (MUI) v5** for component styling and theming
- **React Router v6** for navigation and routing
- **Redux Toolkit** for state management
- **Axios** for HTTP requests
- **Vite** as the build tool and development server

## Features

### Authentication
- JWT-based authentication
- Login and Registration pages
- Protected routes with authentication checks
- Automatic token refresh mechanism
- Secure token storage in localStorage

### Location Management
- View list of all locations (airports and city points)
- Location details including name, city, and country
- Search and filter locations

### Transportation Management
- CRUD operations for transportations
- Support for both flight and other transportation types
- Origin and destination location selection
- Validation for transportation data

### Route Management
- Search routes between locations
- Advanced route validation rules:
  - Maximum 3 transportations per route
  - Exactly one flight per route
  - Only OTHER type transportations allowed before/after flight
  - Maximum one transfer before and after flight
  - Valid connections between transportations
- Interactive route details view with:
  - Separate sections for before flight, main flight, and after flight
  - Total stops, duration, and price information
  - Error handling and validation feedback

## Project Structure

```
aviation-frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   ├── store/           # Redux store configuration
│   │   └── slices/      # Redux slices
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions and helpers
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Key Components

### Pages
- **LoginPage**: User authentication
- **LocationsPage**: Location management
- **TransportationsPage**: Transportation management
- **RoutesPage**: Route search and display

### Services
- **authService**: Handles authentication API calls
- **locationService**: Location-related API calls
- **transportationService**: Transportation-related API calls
- **routeService**: Route-related API calls

### Utils
- **apiInterceptor**: Axios instance with JWT token handling
- **validationUtils**: Frontend validation helpers

## Validation Rules

### Route Search Validation
- Origin and destination locations are required
- Origin and destination cannot be the same location
- API error handling with user-friendly messages

### Route Validation
1. Transportation Count
   - Maximum 3 transportations per route
   - Minimum 1 transportation (the flight)

2. Flight Requirements
   - Exactly one flight per route
   - Flight must connect requested origin and destination

3. Transfer Rules
   - Maximum one transfer before flight
   - Maximum one transfer after flight
   - Only OTHER type transportations allowed as transfers

4. Connection Validation
   - Each transportation's destination must match the next transportation's origin

## Error Handling

- Form-level validation with immediate feedback
- API error handling with user-friendly messages
- Detailed validation error display in route details
- Clear error state management

## UI/UX Features

- Responsive design for all screen sizes
- Interactive tables with hover effects
- Slide-out drawer for detailed information
- Clear error messaging
- Loading states and feedback
- Consistent Material UI styling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```


