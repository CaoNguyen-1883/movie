# Movie Application

A full-stack movie application built with Node.js, Express, TypeScript, and React.

## Project Structure

```
movie-app/
├── movie-be/           # Backend application
│   ├── src/           # Source code
│   ├── docs/          # Backend documentation
│   └── README.md      # Backend setup guide
│
└── movie-fe/          # Frontend application
    ├── src/           # Source code
    ├── docs/          # Frontend documentation
    └── README.md      # Frontend setup guide
```

## Documentation

### Backend Documentation
- [API Documentation](movie-be/docs/API.md) - Complete API reference
- [Backend Setup Guide](movie-be/README.md) - How to set up and run the backend

### Frontend Documentation
- [Frontend Setup Guide](movie-fe/README.md) - How to set up and run the frontend

## Features

### Backend Features
- RESTful API with Express and TypeScript
- MongoDB database with Mongoose ODM
- JWT authentication
- Role-based access control (RBAC)
- Error handling middleware
- Request validation
- API documentation

### Frontend Features
- React with TypeScript
- Modern UI with Material-UI
- State management with Redux Toolkit
- Form handling with React Hook Form
- API integration with Axios
- Responsive design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-app
```

2. Install backend dependencies:
```bash
cd movie-be
npm install
```

3. Install frontend dependencies:
```bash
cd ../movie-fe
npm install
```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Update the variables with your configuration

5. Start the development servers:

Backend:
```bash
cd movie-be
npm run dev
```

Frontend:
```bash
cd movie-fe
npm start
```

## Development

### Backend Development
- Follow the [Backend Setup Guide](movie-be/README.md) for detailed instructions
- API documentation is available in [API.md](movie-be/docs/API.md)

### Frontend Development
- Follow the [Frontend Setup Guide](movie-fe/README.md) for detailed instructions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 