/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate('/items');
    } catch (err) {
      if (!err.response) {
        setError('Failed Connect to Server. Please Check Your Network')
      } else if (err.response.status === 400) {
        setError('Request Rejected by Server')
      } else if (err.response.status === 422) {
        const errors = err.response.data.errors;
        setError(Object.values(errors)[0][0])
      } else {
        setError('Registration Failed. Please Try Again')
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-xl border border-surface-border">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-purity-white mb-2">Create Account</h2>
          <p className="text-text-muted">Sign up to get started</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">
              Full Name
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full bg-deep-sapphire border border-surface-border rounded-lg px-4 py-3 text-purity-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-sapphire focus:border-transparent transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">
              Email Address
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full bg-deep-sapphire border border-surface-border rounded-lg px-4 py-3 text-purity-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-sapphire focus:border-transparent transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">
              Password
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-deep-sapphire border border-surface-border rounded-lg px-4 py-3 text-purity-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-sapphire focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full bg-electric-sapphire hover:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-deep-sapphire" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-electric-sapphire hover:text-blue-400 font-medium transition-colors">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register;