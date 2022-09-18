import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import service from '../../services/services'
import { OperationForm } from '../OperationForm'
import { Operation } from './Operation'
import { UserDataHeader } from './UserDataHeader'
import './Home.css'
import '../LoginRegister/login.css'
import { Message } from '../Message'

export const Home = () => {
	const { user } = useContext(UserContext)
	const [operations, setOperations] = useState([])
	const [userSummary, setUserSummary] = useState(0)
	const [message, setMessage] = useState('')

	useEffect(() => {
		service
			.getOperations()
			.then((response) => setOperations(response))
			.catch((error) => console.error(error.message))
		service
			.getUserSummary()
			.then((response) => response.summary)
			.then((response) => setUserSummary(response))
			.catch((error) => console.error(error.message))
	}, [])

	const handleAddOperation = async (operation) => {
		try {
			const newOperation = await service.sendOperation(operation)
			setOperations([...operations, newOperation])
			setUserSummary(userSummary + newOperation.amount)
		} catch (error) {
			console.error(error.message)
			setMessage('operation could not be added')
			setTimeout(() => {
				setMessage('')
			}, 5000)
		}
	}

	const handleDeleteOperation = (id) => {
		const filterOperations = operations.filter((operation) => operation.id !== id)
		setOperations(filterOperations)
		const newSummary = filterOperations.reduce((tot, operation) => (tot += operation.amount), 0)
		console.log(newSummary)
		setUserSummary(newSummary)
	}

	return (
		<>
			<div className="operation-form">
				<UserDataHeader user={user} summary={userSummary} />
				<p className="operation-form-title">Add a new operation:</p>
				{message && <Message message={message} />}
				<OperationForm handleAddOperation={handleAddOperation} />
			</div>
			<div className="operation-body">
				<div>
					{operations.map((operation) => (
						<Operation
							operation={operation}
							key={operation.id}
							handleDeleteOperation={handleDeleteOperation}
						/>
					))}
				</div>
			</div>
		</>
	)
}
