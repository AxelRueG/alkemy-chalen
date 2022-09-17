import { useState } from 'react'

const formatDate = (date) => {
	let year = date.getFullYear()
	let month = String(date.getMonth() + 1)
	let day = String(date.getDate())

	month = month.length === 1 ? `0${month}` : `${month}`
	day = day.length === 1 ? `0${day}` : `${day}`

	return `${year}-${month}-${day}`
}

export const OperationForm = ({ handleAddOperation, operation = {} }) => {
	const [title, setTitle] = useState(operation.title || '')
	const [description, setDescription] = useState(operation.description || '')
	const [amount, setAmount] = useState(operation.amount || 0)
	const [pub_date, setPubDate] = useState(
		operation.pub_date ? formatDate(operation.pub_date) : formatDate(new Date())
	)

	const handleTitle = (event) => setTitle(event.target.value)
	const handleDescription = (event) => setDescription(event.target.value)
	const handleAmount = (event) => setAmount(event.target.value)
	const handleDate = (event) => setPubDate(event.target.value)

	const handleSubmit = async (event) => {
		event.preventDefault()

		await handleAddOperation({
			title: title || null,
			description,
			amount,
			pub_date: new Date(pub_date),
			id_category: 2,
		})

		if (!operation.title) {
			setTitle('')
			setDescription('')
			setAmount(0)
		}
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
