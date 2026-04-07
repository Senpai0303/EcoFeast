// frontend/src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

function AuthPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Donor'); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            if (isLogin) {
                // Handle Login
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const res = await axios.get(`http://localhost:5000/api/users/${userCredential.user.uid}`);
                onLogin(userCredential.user, res.data.role);
            } else {
                // Handle Signup
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await axios.post('http://localhost:5000/api/users/register', {
                    firebaseUid: userCredential.user.uid,
                    email: userCredential.user.email,
                    role: role
                });
                onLogin(userCredential.user, role);
            }
        } catch (err) {
            // Provide cleaner error messages
            if (err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists.');
            } else {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6 font-sans">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md transform transition-all">
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 tracking-tight mb-2">
                        EcoFeast
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">
                        {isLogin ? 'Welcome back! Please enter your details.' : 'Create an account to start reducing waste.'}
                    </p>
                </div>
                
                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center animate-pulse">
                        {error}
                    </div>
                )}
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="you@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors shadow-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors shadow-sm outline-none"
                        />
                    </div>
                    
                    {!isLogin && (
                        <div className="animate-fade-in-down">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors shadow-sm outline-none cursor-pointer"
                            >
                                <option value="Donor">Individual Donor</option>
                                <option value="NGO">Registered NGO / Charity</option>
                            </select>
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-xl text-white font-bold text-lg shadow-md transition-all ${
                            isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                {/* Footer Toggle */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account yet? " : "Already have an account? "}
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }} 
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors focus:outline-none"
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AuthPage;