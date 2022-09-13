import { useContext, useEffect } from 'react'
import service from './services/services'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import { LoginForm } from './components/LoginForm'
import { Home } from './components/Home'
import { UserContext } from './contexts/UserContext'

const App = () => {
	const { user, setUser } = useContext(UserContext)

	useEffect(() => {
		console.log('me estoy ejecutando (soy el Effect)')
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
						path="/login"
						element={user ? <Navigate to="/" /> : <LoginForm />}
					/>
					<Route
						path="/"
						user={user}
						element={user ? <Home /> : <Navigate to="/login" />}
					/>
				</Routes>
			</Router>
		</div>
	)
}

export default App
