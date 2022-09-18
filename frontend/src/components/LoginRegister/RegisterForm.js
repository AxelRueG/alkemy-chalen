import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import { Message } from '../Message'
import service from '../../services/services'

export const RegisterForm = () => {
	const { setUser } = useContext(UserContext)
	const navigate = useNavigate()

	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
	const [message, setMessage] = useState(null)

	const handleUsername = (event) => setUsername(event.target.value)
	const handleEmail = (event) => setEmail(event.target.value)
	const handlePassword = (event) => setPassword(event.target.value)
	const handlePasswordConfirm = (event) => setPasswordConfirm(event.target.value)

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (password !== passwordConfirm) {
			setMessage('password dont match')
			return
		}

		const responseStatus = await service.register({ username, password, email })

		if (responseStatus !== 201) {
			setMessage('invalid fiels')
			return
		}

		const user = await service.login(username, password)
		setUser(user)
		window.localStorage.setItem('userData', JSON.stringify(user))
		service.setToken(user.token)
		navigate('/')
	}

	return (
		<div className="container">
			<p className="operation-form-title">Register</p>
			{message && <Message message={message} />}
			<form className="container-form">
				<input type="text" value={username} onChange={handleUsername} placeholder="usename" />
				<input type="email" value={email} onChange={handleEmail} placeholder="email" />
				<input type="password" value={password} onChange={handlePassword} placeholder="password" />
				<input
					type="password"
					value={passwordConfirm}
					onChange={handlePasswordConfirm}
					placeholder="confirm password"
				/>
				<button onClick={handleSubmit}>sign in</button>
			</form>
			<p className="link-register-login">
				you have an account? <Link to="/login">log in</Link>
			</p>
		</div>
	)
}
