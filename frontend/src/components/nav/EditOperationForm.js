import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import service from '../../services/services'
import { OperationForm } from '../OperationForm'
import { Message } from '../Message'

export const EditOperationForm = () => {
	const { id } = useParams()
	const navigate = useNavigate()

	const [operation, setOperation] = useState(null)
	const [message, setMessage] = useState('')

	useEffect(() => {
		service
			.getOnlyOperation(id)
			.then((response) => {
				return { ...response, pub_date: new Date(response.pub_date) }
			})
			.then((response) => setOperation(response))
			.catch((error) => console.error(error.message))
	}, [id])

	const handleAddOperation = async (operationData) => {
		try {
			await service.updateOperation(id, operationData)
			navigate('/')
		} catch (error) {
			setMessage('could not update operation')
		}
	}

	return operation ? (
		<>
			{message !== '' && <Message message={message} />}
			<h2>Edit the operation {operation.title}</h2>
			<OperationForm handleAddOperation={handleAddOperation} operation={operation} />
		</>
	) : (
		<></>
	)
}
