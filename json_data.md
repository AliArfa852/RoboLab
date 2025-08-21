# JSON Data Structures for RoboLabPK

This document outlines the required JSON data structures for the RoboLabPK website to function properly.

## Projects Data Structure

### Main Project Object
```json
{
  "project": {
    "id": "string", // Unique identifier for the project
    "name": "string", // Project name/title
    "description": "string", // Detailed project description
    "tags": ["string"], // Array of project tags (e.g., ["IoT", "Arduino", "Sensors"])
    "toolStack": ["string"], // Array of tools/technologies used
    "components": [
      {
        "name": "string", // Component name
        "quantity": "number", // Quantity needed
        "category": "string", // Component category
        "datasheet": "string" // Optional: URL to component datasheet
      }
    ],
    "extraDetails": {
      "estimatedCost": "number", // Project cost estimate
      "currency": "string", // Currency code (USD, EUR, PKR, etc.)
      "difficultyLevel": "string", // "Beginner" | "Intermediate" | "Advanced"
      "estimatedTime": "string" // Time estimate (e.g., "2 days", "1 week")
    },
    "status": "string", // "Draft" | "Planned" | "In Progress" | "Completed"
    "isPublic": "boolean", // Whether project is public or private
    "category": "string", // Project category
    "lastModified": "string", // Last modification timestamp
    "thumbnail": "string", // URL to project thumbnail image
    "createdAt": "string", // ISO timestamp of creation
    "updatedAt": "string", // ISO timestamp of last update
    "userId": "string", // ID of the user who created the project
    "likes": "number", // Number of likes (for public projects)
    "views": "number", // Number of views
    "forks": "number" // Number of times project was forked/copied
  }
}
```

### Component Categories
Available component categories:
- `"Microcontroller"` - Arduino, ESP32, Raspberry Pi, etc.
- `"Sensor"` - Temperature, humidity, motion sensors, etc.
- `"Actuator"` - Motors, servos, relays, etc.
- `"Display"` - LCD, LED, OLED displays
- `"Power"` - Batteries, power supplies, regulators
- `"Connectivity"` - WiFi modules, Bluetooth, etc.
- `"Misc"` - Wires, resistors, breadboards, etc.

### Project Status Values
- `"Draft"` - Project is being planned/designed
- `"Planned"` - Project is planned but not started
- `"In Progress"` - Project is currently being worked on
- `"Completed"` - Project is finished

### Difficulty Levels
- `"Beginner"` - Easy projects for newcomers
- `"Intermediate"` - Moderate complexity projects
- `"Advanced"` - Complex projects requiring experience

## User Profile Data Structure

```json
{
  "profile": {
    "id": "string", // Unique user identifier
    "userId": "string", // Reference to auth user ID
    "email": "string", // User email
    "fullName": "string", // User's full name
    "avatarUrl": "string", // URL to user's avatar image
    "bio": "string", // User biography/description
    "skills": ["string"], // Array of user skills
    "location": "string", // User location
    "website": "string", // User's personal website
    "githubUrl": "string", // GitHub profile URL
    "linkedinUrl": "string", // LinkedIn profile URL
    "joinedAt": "string", // ISO timestamp of when user joined
    "projectsCount": "number", // Total number of projects
    "publicProjectsCount": "number", // Number of public projects
    "followersCount": "number", // Number of followers
    "followingCount": "number", // Number of people following
    "isVerified": "boolean", // Whether user is verified
    "preferences": {
      "theme": "string", // "light" | "dark" | "system"
      "emailNotifications": "boolean",
      "publicProfile": "boolean",
      "showEmail": "boolean"
    }
  }
}
```

## Project Collections/Lists

### Projects List Response
```json
{
  "projects": [
    // Array of project objects (see Main Project Object above)
  ],
  "pagination": {
    "page": "number", // Current page number
    "limit": "number", // Items per page
    "total": "number", // Total number of projects
    "totalPages": "number" // Total number of pages
  },
  "filters": {
    "status": "string", // Applied status filter
    "category": "string", // Applied category filter
    "difficulty": "string", // Applied difficulty filter
    "search": "string" // Applied search query
  }
}
```

## Component Library Data Structure

```json
{
  "component": {
    "id": "string", // Unique component ID
    "name": "string", // Component name
    "category": "string", // Component category
    "description": "string", // Component description
    "manufacturer": "string", // Manufacturer name
    "partNumber": "string", // Manufacturer part number
    "datasheet": "string", // URL to datasheet
    "image": "string", // URL to component image
    "specifications": {
      "voltage": "string", // Operating voltage
      "current": "string", // Current consumption
      "dimensions": "string", // Physical dimensions
      "temperature": "string", // Operating temperature range
      "interface": "string" // Communication interface (I2C, SPI, etc.)
    },
    "pricing": [
      {
        "vendor": "string", // Vendor name
        "price": "number", // Price
        "currency": "string", // Currency
        "url": "string", // Purchase URL
        "inStock": "boolean" // Availability status
      }
    ],
    "compatibility": ["string"], // Compatible platforms (Arduino, ESP32, etc.)
    "tags": ["string"], // Component tags
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## Tutorial/Guide Data Structure

```json
{
  "tutorial": {
    "id": "string",
    "title": "string",
    "description": "string",
    "content": "string", // Markdown content
    "difficulty": "string", // "Beginner" | "Intermediate" | "Advanced"
    "estimatedTime": "string", // Time to complete
    "category": "string", // Tutorial category
    "tags": ["string"],
    "author": {
      "id": "string",
      "name": "string",
      "avatarUrl": "string"
    },
    "components": ["string"], // Required components
    "tools": ["string"], // Required tools
    "steps": [
      {
        "title": "string",
        "content": "string",
        "image": "string", // Optional step image
        "code": "string" // Optional code snippet
      }
    ],
    "relatedProjects": ["string"], // Related project IDs
    "likes": "number",
    "views": "number",
    "isPublished": "boolean",
    "publishedAt": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## Store/Shop Data Structure

```json
{
  "product": {
    "id": "string",
    "name": "string",
    "description": "string",
    "category": "string",
    "images": ["string"], // Array of image URLs
    "price": "number",
    "currency": "string",
    "discount": "number", // Discount percentage
    "inStock": "boolean",
    "stockQuantity": "number",
    "specifications": {
      // Product-specific specifications
    },
    "vendor": {
      "id": "string",
      "name": "string",
      "rating": "number"
    },
    "reviews": [
      {
        "userId": "string",
        "rating": "number", // 1-5 stars
        "comment": "string",
        "createdAt": "string"
      }
    ],
    "tags": ["string"],
    "averageRating": "number",
    "totalReviews": "number",
    "isActive": "boolean",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## API Response Format

All API responses should follow this structure:

```json
{
  "success": "boolean",
  "data": {}, // The actual data (project, user, etc.)
  "message": "string", // Success/error message
  "error": {
    "code": "string", // Error code
    "details": "string" // Error details
  },
  "timestamp": "string", // ISO timestamp
  "requestId": "string" // Unique request identifier
}
```

## Database Schema Considerations

### Required Tables
1. **profiles** - User profile information
2. **projects** - Project data
3. **project_components** - Components for each project
4. **components** - Component library
5. **tutorials** - Tutorial/guide content
6. **products** - Store products
7. **reviews** - Product/project reviews
8. **likes** - User likes for projects/tutorials
9. **follows** - User following relationships

### Indexes
- `projects.userId` - For user's projects lookup
- `projects.status` - For status filtering
- `projects.isPublic` - For public project queries
- `projects.createdAt` - For chronological sorting
- `components.category` - For component filtering
- `profiles.userId` - For profile lookup

### Row Level Security (RLS) Policies
- Users can only edit their own projects and profiles
- Public projects are readable by everyone
- Private projects are only accessible by the owner
- Component library is readable by all authenticated users