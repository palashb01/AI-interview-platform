# 🤖 AI Interview Platform

Welcome to the **AI Interview Platform**! 🚀

A modern, full-stack web application to help you practice coding interviews with AI-powered feedback, real-time code evaluation, and beautiful UI/UX. Built with Next.js, Supabase, Tailwind CSS, and more.

---

## ✨ Features

- 🧑‍💻 **AI-Powered Coding Interviews**: Practice coding questions and get instant, detailed feedback.
- 📝 **Live Code Editor**: Write and submit code in a Monaco-powered editor.
- 📊 **Performance Analytics**: Get ratings on code quality, problem-solving, communication, and more.
- 🗂️ **Past Interviews**: Review your previous interviews, solutions, and feedback.
- 🔒 **Authentication**: Sign up or log in with email/password or Google OAuth.
- 🌗 **Dark/Light Mode**: Beautiful, responsive design with theme support.
- ⚡ **Fast & Modern UI**: Built with Next.js App Router, Tailwind CSS, Framer Motion, and more.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Lucide Icons
- **Editor**: Monaco Editor (read-only for solutions)
- **Backend**: Supabase (Auth, Database)
- **Authentication**: Supabase Auth (Email/Password, Google OAuth)
- **Other**: Lottie Animations, react-icons, react-toast, etc.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-interview-platform.git
cd ai-interview-platform
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GENERATIVE_AI_API_KEY=your_ai_studio_key
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_client_key
```

Get these values from your [Supabase project](https://app.supabase.com/).

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📁 Folder Structure

```
app/
  (Auth)/           # Auth pages (login, signup)
  api/              # API routes (Next.js route handlers)
  components/       # Reusable UI components
  past-interviews/  # Past interviews and feedback
  interview/        # Interview flow (start, feedback, etc.)
  globals.css       # Global styles
  ...
utils/
  supabase/         # Supabase client and actions
public/
  lottie/           # Lottie animation files
```

---

## 🧑‍🎓 Usage

- **Sign Up / Log In**: Use email/password or Google to authenticate.
- **Start Interview**: Begin a new coding interview, solve the problem, and submit your code.
- **Get Feedback**: Receive AI-generated feedback and ratings.
- **Review Past Interviews**: View your solutions and feedback in the Past Interviews section.

---

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [Supabase](https://supabase.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [LottieFiles](https://lottiefiles.com/)

---

Made with ❤️ for developers who want to ace their coding interviews by Palash Baderia!
