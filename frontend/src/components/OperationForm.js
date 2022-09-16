import { useState } from 'react'
import service from '../services/services'

const formatDate = (date) => {
	let year = date.getFullYear()
	let month = String(date.getMonth() + 1)
	let day = String(date.getDay())

	month = month.length === 1 ? `0${month}` : `${month}`
	day = day.length === 1 ? `0${day}` : `${day}`

	return `${year}-${month}-${day}`
}

export const OperationForm = ({ operations, setOperations }) => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [amount, setAmount] = useState(0)
	const [pub_date, setPubDate] = useState(formatDate(new Date()))

	const handleTitle = (event) => setTitle(event.target.value)
	const handleDescription = (event) => setDescription(event.target.value)
	const handleAmount = (event) => setAmount(event.target.value)
	const handleDate = (event) => setPubDate(event.target.value)

	const handleSubmit = async (event) => {
		event.preventDefault()

		const newOperation = await service.sendOperation({
			title,
			description,
			amount,
			pub_date: new Date(pub_date),
			id_category: 2,
		})
		setOperations([...operations, newOperation])
		setTitle('')
		setDescription('')
		setAmount(0)
	}

	return (
		<form>
			<input type="text" onChange={handleTitle} value={title} />
			<br />
			<input type="text" onChange={handleDescription} value={description} />
			<br />
			<input type="numeric" onChange={handleAmount} value={amount} />
			<br />
			<input type="date" onChange={handleDate} value={pub_date} />
			<br />
			<button onClick={handleSubmit}>ADD</button>
		</form>
	)
}
