import { LoginForm } from "@/components/auth/login-form";

// Constants for styling to improve readability and maintainability
const CONTAINER_STYLES = "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8";
const CONTENT_STYLES = "max-w-md w-full space-y-8";
const TEXT_CENTER = "text-center";
const HEADING_STYLES = "text-3xl font-bold text-gray-900";
const TEXT_STYLES = "text-sm text-gray-600";
const LINK_STYLES = "font-medium text-blue-600 hover:text-blue-500";

export default function LoginPage() {
  return (
    <div className={CONTAINER_STYLES}>
      <div className={CONTENT_STYLES}>
        <header className={TEXT_CENTER}>
          <h1 className={HEADING_STYLES}>Polling App</h1>
          <p className={`mt-2 ${TEXT_STYLES}`}>
            Sign in to your account
          </p>
        </header>
        
        <LoginForm />
        
        <footer className={TEXT_CENTER}>
          <p className={TEXT_STYLES}>
            Don't have an account?{" "}
            <a href="/register" className={LINK_STYLES}>
              Sign up
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
