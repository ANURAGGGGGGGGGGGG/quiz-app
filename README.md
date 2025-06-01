# Quiz App

![Quiz App Logo](./public/favicon-32x32.png)

A modern, interactive quiz application built with React and Vite that allows users to test their knowledge across various categories and difficulty levels.

## Features

- **Category Selection**: Choose from a wide range of quiz categories
- **Difficulty Levels**: Select your preferred difficulty (easy, medium, hard)
- **Progress Tracking**: Visual progress bar shows your advancement through the quiz
- **Instant Feedback**: Immediate scoring and feedback on answers
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Score Summary**: Detailed results page after completing the quiz

## Technologies Used

- **React**: Frontend UI library
- **Vite**: Next generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Open Trivia Database API**: Source for quiz questions

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/quiz-app.git
   cd quiz-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

This application uses the [Open Trivia Database API](https://opentdb.com/) to fetch quiz questions. The API provides:

- Multiple categories
- Various difficulty levels
- Different question types (multiple choice, true/false)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Open Trivia Database](https://opentdb.com/) for providing the quiz API
- [React](https://reactjs.org/) documentation
- [Vite](https://vitejs.dev/) for the excellent development experience
- [Tailwind CSS](https://tailwindcss.com/) for styling
