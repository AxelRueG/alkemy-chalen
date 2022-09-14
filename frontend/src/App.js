import { useContext, useEffect } from 'react'
import service from './services/services'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginForm } from './components/LoginForm'
import { Home } from './components/Home'
import { UserContext } from './contexts/UserContext'
import { RegisterForm } from './components/RegisterForm'
import { PublicRoutes } from './Routes/PublicRoutes'
import { PrivateRoutes } from './Routes/PrivateRoutes'

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
			<Router>
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
				</Routes>
			</Router>
		</div>
	)
}

export default App
