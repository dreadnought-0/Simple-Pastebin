# Dark Space Labs Pastebin

![Dark Space Labs Pastebin](https://darkspacelabs.com/assets/logo.png)

A secure, minimalist code sharing platform with end-to-end encryption for developers and teams.

## 🚀 Features

- **Instant Sharing**: Create and share code snippets with a single click
- **Syntax Highlighting**: Support for multiple programming languages
- **Privacy-Focused**: All pastes expire after 30 days automatically
- **No Registration**: Share code snippets without creating an account
- **Responsive Design**: Works on desktop and mobile devices
- **View Tracking**: See how many times your paste has been viewed
- **Dark Mode**: Easy on the eyes for late-night coding sessions

## 🔒 Security Features

- No user registration or personal information collection
- All pastes automatically expire after 30 days
- All data stored in MariaDB with appropriate security measures
- Content Security Policy implemented with Helmet.js
- HTTPS enforced for all connections

## 🛠️ Technology Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MariaDB
- **Build System**: Vite
- **Syntax Highlighting**: react-syntax-highlighter
- **Icons**: Lucide React

## 📋 Usage

1. Visit [paste.darkspacelabs.com](https://paste.darkspacelabs.com)
2. Paste your code in the editor
3. Select the language for proper syntax highlighting
4. Click "Create Paste"
5. Share the generated URL with others

## 🖥️ Screenshots

![Home Page](https://example.com/screenshots/home.png)
![Created Paste](https://example.com/screenshots/paste.png)

## 🔧 Local Development

### Prerequisites

- Node.js 18+
- npm or pnpm
- MariaDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/dreadnought-0/pastebin.git
cd pastebin
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=pastebin
```

4. Start the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## 🚢 Deployment

This application is designed to run on Node.js-compatible hosting services:

- Plesk with Node.js support
- AWS, Azure, or GCP
- Heroku, Vercel, or Netlify
- Docker containers

Detailed deployment instructions are available in the [DEPLOYMENT.md](DEPLOYMENT.md) file.

## 📝 API Reference

### Create a Paste

```
POST /api/paste
```

**Request Body:**
```json
{
  "content": "console.log('Hello World');",
  "language": "javascript"
}
```

**Response:**
```json
{
  "pasteId": "a1b2c3d4e5f6"
}
```

### Get a Paste

```
GET /api/paste/:pasteId
```

**Response:**
```json
{
  "content": "console.log('Hello World');",
  "language": "javascript",
  "views": 5,
  "createdAt": "2025-02-27T12:34:56.789Z"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact

Dark Space Labs - [contact@darkspacelabs.com](mailto:contact@darkspacelabs.com)

Project Link: [https://github.com/dreadnought-0/pastebin](https://github.com/dreadnought-0/pastebin)
