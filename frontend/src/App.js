import { useContext, useEffect } from 'react'
import service from './services/services'
import { Routes, Route, NavLink } from 'react-router-dom'
import { LoginForm } from './components/LoginForm'
import { Home } from './components/Home'
import { UserContext } from './contexts/UserContext'
import { RegisterForm } from './components/RegisterForm'
import { PublicRoutes } from './Routes/PublicRoutes'
import { PrivateRoutes } from './Routes/PrivateRoutes'
import { EditOperationForm } from './components/EditOperationForm'

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

	return (
		<div className="App">
			<header>
				<h1>Presupuesto Personal</h1>
				{user ? (
					<ul>
						<li>
							<NavLink to="/">Home</NavLink>
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
					user={user}
					element={
						<PrivateRoutes>
							<Home />
						</PrivateRoutes>
					}
				/>
				<Route
					path="/operation/:id"
					user={user}
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
