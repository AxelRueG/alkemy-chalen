import { useContext, useState } from 'react'
import service from '../../services/services'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import './login.css'
import { Message } from '../Message'

export const LoginForm = () => {
	const { setUser } = useContext(UserContext)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [message, setMessage] = useState('')
	const navigate = useNavigate()

	const handleUsername = (event) => setUsername(event.target.value)
	const handlepassword = (event) => setPassword(event.target.value)

	const handleClick = async (event) => {
		event.preventDefault()
		try {
			const user = await service.login(username, password)
			setUser(user)
			window.localStorage.setItem('userData', JSON.stringify(user))
			service.setToken(user.token)
			setUsername('')
			setPassword('')
			navigate('/')
		} catch {
			setMessage('invalid credentials')
		}
	}

	return (
		<div className="container">
			<p className="operation-form-title">Login</p>
			{message && <Message message={message} />}
			<form className="container-form">
				<input type="text" value={username} placeholder="username" onChange={handleUsername} />
				<input type="password" value={password} placeholder="password" onChange={handlepassword} />
				<button onClick={handleClick}>log in</button>
			</form>
			<Link className="link-register-login" to="/register">
				sign in
			</Link>
		</div>
	)
}
