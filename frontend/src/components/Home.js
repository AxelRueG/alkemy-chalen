import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

export const Home = () => {
	const { user, setUser } = useContext(UserContext)

	const handleLogout = () => {
		window.localStorage.removeItem('userData')
		setUser(undefined)
	}
	return (
		<>
			<h1>Home</h1>
			<p>Wellcome {user.username}</p>
			<button onClick={handleLogout}> logout </button>
		</>
	)
}
