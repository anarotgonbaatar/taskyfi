// Account management page: handles user info and account
"use client"
import { useEffect, useState } from "react"
import { FaAngleLeft, FaSignOutAlt, FaTrashAlt, FaUser } from "react-icons/fa"
import Link from "next/link"
import EditableText from "../components/EditableText"
import { signOut } from "next-auth/react"
import "./account.css"

export default function AccountPage() {
	const [ profilePic, setProfilePic ] = useState<string | null>( null )
	const [ fName, setFName ] = useState("")
	const [ lName, setLName ] = useState("")
	const [ email, setEmail ] = useState("")
	const [ loading, setLoading ] = useState( true )

	// Get user details from backend
	useEffect(() => {
		async function getUserDetails() {
			const res = await fetch( "/api/user" )
			const data = await res.json()
			setFName( data.fName )
			setLName( data.lName )
			setEmail( data.email )
			setProfilePic( data.profilePic || null )
			setLoading( false )
		}
		getUserDetails()
	}, [])

	// Handle profile picture upload
	// const updateProfilePic = async ( event: React.ChangeEvent<HTMLInputElement> ) => {
	// 	const file = event.target.files?.[0]
	// 	if ( file ) {
	// 		const formData = new FormData()
	// 		formData.append( "profilePic", file )

	// 		const res = await fetch( "/api/user/profile-pic", {
	// 			method: "POST",
	// 			body: formData,
	// 		})

	// 		if ( res.ok ) {
	// 			const data = await res.json()
	// 			setProfilePic( data.profilePic )
	// 		}
	// 	}
	// }

	// Handle user info update
	const updateUserInfo = async ( field: string, value: string ) => {
		await fetch( "/api/user", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ [field]: value }),
		})
	}

	// Handle sign out
	const handleSignOut = async () => {
		await fetch( "/api/auth/signout", { method: "POST" })
		await signOut()
		window.location.href = "./auth"
	}

	return (
		<div>
			<div className="acc-menu">
				<h1>Account Management</h1>
				<Link href="./dashboard" className="acc-btn">
					<FaAngleLeft className="self-center"/>
					Back to Dashboard
				</Link>

				{ loading ? (
					<p>Loading user info...</p>
				):(
					<div className="user-info flex p-2 gap-2 items-center">
						<label htmlFor="profile-pic-upload" className="profile-pic flex">
							{ profilePic ? (
								<img src={ profilePic } alt="Picture" className="profile-img" />
							):(
								<FaUser className="profile-img self-center"/>
							)}
						</label>

						<div className="flex-col">
							<EditableText text={ fName } onSave={ (value) => { setFName(value); updateUserInfo( "fName", value ) }}/>
							<EditableText text={ lName } onSave={ (value) => { setLName(value); updateUserInfo( "lName", value ) }}/>
							<EditableText text={ email } onSave={ (value) => { setEmail(value); updateUserInfo( "email", value ) }}/>
						</div>
					</div>
				)}

				<h1>Danger Zone</h1>
				<div className="acc-btn sign-out-btn bg-yellow-800" onClick={ handleSignOut }>
					Sign Out
					<FaSignOutAlt className="self-center w-5 h-5"/>
				</div>
				<div className="acc-btn delete-acc-out-btn bg-red-800">
					Delete Account
					<FaTrashAlt className="self-center w-5 h-5"/>
				</div>
			</div>
		</div>
	)
}