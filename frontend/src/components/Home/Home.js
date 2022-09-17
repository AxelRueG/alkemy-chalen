import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import service from '../../services/services'
import { OperationForm } from '../OperationForm'
import { Operation } from './Operation'
import { UserDataHeader } from './UserDataHeader'

export const Home = () => {
	const { user } = useContext(UserContext)
	const [operations, setOperations] = useState([])
	const [userSummary, setUserSummary] = useState(0)

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
		const newOperation = await service.sendOperation(operation)
		setOperations([...operations, newOperation])
		setUserSummary(userSummary + newOperation.amount)
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
			<h1>Home</h1>
			<UserDataHeader user={user} summary={userSummary} />
			<div>
				<OperationForm handleAddOperation={handleAddOperation} />
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
