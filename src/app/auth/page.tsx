// Authentication page: handles sign in/up
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
	const [ tab, setTab ] = useState< "signin" | "signup" >("signin")
	const [ formData, setFormData ] = useState({
		fName: "",
		lName: "",
		email: "",
		password: "",
		confirmPassword: "",
	})

	const [ error, setError ] = useState("")
	const router = useRouter()

	const handleInputChange = ( e: React.ChangeEvent< HTMLInputElement > ) => {
		setFormData({ ...formData, [ e.target.name ]: e.target.value })
	}

	const handleSignIn = async () => {
		const res = await signIn( "credentials", {
			email: formData.email,
			password: formData.password,
			redirect: false,
		})

		if ( res?.error ) {
			setError( "Account doesn't exist. Please sign up or try again." )
		} else {
			router.push( "./dashboard" )
		}
	}

	const handleSignUp = async () => {
		if ( formData.password != formData.confirmPassword ) {
			setError( "Passwords do not match." )
			return
		}

		try {
			const res = await fetch( "/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fName: formData.fName,
					lName: formData.lName,
					email: formData.email,
					password: formData.password,
				})
			})

			if ( res.ok ) {
				router.push( "./dashboard" )
			} else {
				const data = await res.json()
				setError( data.message || "Account already exists. Please sign in or try again." )
			}
		} catch ( error ) {
			setError( "Something went wrong." )
		}
	}

	return (
		<div className="auth-box">
			
			{/* Containes both tab buttons */}
			<div className="tabs-box flex justify-between">
				{/* Sign in button */}
				<button
					onClick={() => {
						setTab( "signin" )
						setError("")
					}}
					className={`px-4 py-2 tab-btn ${
						tab === "signin" ? "text-white bg-blue-700" : "text-gray-400"
					}`}
					type="button"
				>
					Sign In
				</button>

				{/* Sign up button */}
				<button
					onClick={() => {
						setTab( "signup" )
						setError("")
					}}
					className={`px-4 py-2 tab-btn ${
						tab === "signup" ? "text-white bg-blue-700" : "text-gray-400"
					}`}
					type="button"
				>
					Sign Up
				</button>
			</div>

			{ tab === "signin" ? (
				// Sign In
				<div className="inputs-box">
					<input
						className="auth-input"
						type="email"
						name="email"
						placeholder="Email"
						value={ formData.email }
						onChange={ handleInputChange }
					/>
					<input
						className="auth-input"
						type="password"
						name="password"
						placeholder="Password"
						value={ formData.password }
						onChange={ handleInputChange }
					/>
					<button onClick={ handleSignIn }>SIGN IN</button>
					<p>Forgot Password?</p>
				</div>
			) : (
				// Sign Up
				<div className="inputs-box">
					<input
						className="auth-input"
						type="text"
						name="fName"
						placeholder="First name"
						value={ formData.fName }
						onChange={ handleInputChange }
					/>
					<input
						className="auth-input"
						type="text"
						name="lName"
						placeholder="Last name"
						value={ formData.lName }
						onChange={ handleInputChange }
					/>
					<input
						className="auth-input"
						type="email"
						name="email"
						placeholder="Email"
						value={ formData.email }
						onChange={ handleInputChange }
					/>
					<input
						className="auth-input"
						type="password"
						name="password"
						placeholder="Password"
						value={ formData.password }
						onChange={ handleInputChange }
					/>
					<input
						className="auth-input"
						type="password"
						name="confirmPassword"
						placeholder="Confirm Password"
						value={ formData.confirmPassword }
						onChange={ handleInputChange }
					/>
					<button onClick={ handleSignUp }>SIGN UP</button>
				</div>
			)}

			{ error && <p className="err-message"> { error } </p> }

		</div>
	)
}