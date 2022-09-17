import { useState } from 'react'
import service from '../../services/services'
import { Message } from '../Message'

export const EditUserPassword = () => {
	const [oldpassword, setCurrentPass] = useState('')
	const [password1, setPassword1] = useState('')
	const [password2, setPassword2] = useState('')
	const [message, setMessage] = useState('')

	const handleCurrentPass = (event) => setCurrentPass(event.target.value)
	const handlepassword1 = (event) => setPassword1(event.target.value)
	const handlepassword2 = (event) => {
		setPassword2(event.target.value)
		if (password1 !== event.target.value) setMessage("passwords doesn't match")
		else setMessage('')
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			await service.updateUSerPassword({ oldpassword, password1, password2 })
			setMessage('password changed successfully')
			setCurrentPass('')
			setPassword1('')
			setPassword2('')
		} catch (error) {
			console.log(error.message)
			setMessage('invalid fields')
		}
	}

	return (
		<>
			{message && <Message message={message} />}
			<form>
				<input
					type="password"
					onChange={handleCurrentPass}
					value={oldpassword}
					placeholder="current password"
				/>
				<br />
				<input
					type="password"
					onChange={handlepassword1}
					value={password1}
					placeholder="new password"
				/>
				<br />
				<input
					type="password"
					onChange={handlepassword2}
					value={password2}
					placeholder="confirm new password"
				/>
				<br />
				<button onClick={handleSubmit}>change password</button>
			</form>
		</>
	)
}
