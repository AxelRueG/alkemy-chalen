import { useContext, useState } from 'react'
import service from '../../services/services'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'

export const LoginForm = () => {
	const { setUser } = useContext(UserContext)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate()

	const handleUsername = (event) => setUsername(event.target.value)
	const handlepassword = (event) => setPassword(event.target.value)

	const handleClick = async (event) => {
		event.preventDefault()

		const user = await service.login(username, password)
		setUser(user)
		window.localStorage.setItem('userData', JSON.stringify(user))
		service.setToken(user.token)

		setUsername('')
		setPassword('')

		navigate('/')
	}

	return (
		<>
			<form>
				<input type="text" value={username} placeholder="username" onChange={handleUsername} />
				<input type="password" value={password} placeholder="password" onChange={handlepassword} />
				<button onClick={handleClick}>log in</button>
			</form>
			<Link to="/register">sign in</Link>
		</>
	)
}
