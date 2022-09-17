import { useContext, useEffect } from 'react'
import service from './services/services'
import { Routes, Route, NavLink } from 'react-router-dom'
import { UserContext } from './contexts/UserContext'
import { PublicRoutes } from './Routes/PublicRoutes'
import { PrivateRoutes } from './Routes/PrivateRoutes'

import { LoginForm } from './components/LoginRegister/LoginForm'
import { RegisterForm } from './components/LoginRegister/RegisterForm'
import { Home } from './components/Home/Home'
import { EditOperationForm } from './components/nav/EditOperationForm'
import { EditUserProfileImg } from './components/nav/EditUserProfileImg'
import { EditUserPassword } from './components/nav/EditUserPassword'

const App = () => {
	const { user, setUser } = useContext(UserContext)

	useEffect(() => {
		const userData = window.localStorage.getItem('userData')
		if (userData) {
			const userCredentials = JSON.parse(userData)
			setUser(userCredentials)
			service.setToken(userCredentials.token)
		}
	}, [setUser])

	const handleLogout = () => {
		window.localStorage.removeItem('userData')
		setUser(undefined)
	}

	return (
		<div className="App">
			<header>
				<h1>Personal Pudget</h1>
				<nav>
					{user ? (
						<ul>
							<li>
								<NavLink to="/">Home</NavLink>
							</li>
							<li>
								config
								<ul>
									<li>
										<NavLink to="/user/profile">change profile image</NavLink>
									</li>
									<li>
										<NavLink to="/user/password">change password</NavLink>
									</li>
								</ul>
							</li>
							<li>
								<button onClick={handleLogout}> logout </button>
							</li>
						</ul>
					) : (
						<ul>
							<li>
								<NavLink to="/login">Log in</NavLink>
							</li>
							<li>
								<NavLink to="/register">Sign in</NavLink>
							</li>
						</ul>
					)}
				</nav>
			</header>
			<Routes>
				<Route
					path="/register"
					element={
						<PublicRoutes>
							<RegisterForm />
						</PublicRoutes>
					}
				/>
				<Route
					path="/login"
					element={
						<PublicRoutes>
							<LoginForm />
						</PublicRoutes>
					}
				/>
				<Route
					path="/"
					element={
						<PrivateRoutes>
							<Home />
						</PrivateRoutes>
					}
				/>
				<Route
					path="/user/profile"
					element={
						<PrivateRoutes>
							<EditUserProfileImg />
						</PrivateRoutes>
					}
				/>
				<Route
					path="/user/password"
					element={
						<PrivateRoutes>
							<EditUserPassword />
						</PrivateRoutes>
					}
				/>
				<Route
					path="/operation/:id"
					element={
						<PrivateRoutes>
							<EditOperationForm />
						</PrivateRoutes>
					}
				/>
			</Routes>
		</div>
	)
}

export default App
