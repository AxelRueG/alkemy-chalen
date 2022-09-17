import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import service from '../services/services'
import { OperationForm } from './OperationForm'

export const borderStyle = { border: '1px solid red' }

const Operation = ({ operation, handleDeleteOperation }) => {
	const navigate = useNavigate()

	const handleDelete = async () => {
		try {
			await service.deleteOperation(operation.id)
			handleDeleteOperation(operation.id)
		} catch {
			alert('something')
		}
	}

	const handleEdit = () => navigate(`/operation/${operation.id}`)

	const humanizate = (date) => {
		const oDate = new Date(date)
		return `${oDate.getDate()}/${oDate.getMonth()}/${oDate.getFullYear()}`
	}

	return (
		<div style={borderStyle}>
			<div>
				<img src={operation.img} alt="category" />
				<div>
					<h3>{operation.title}</h3>
					<p>{humanizate(operation.pub_date)}</p>
				</div>
			</div>
			<p>
				<span>{operation.description}</span> $<span>{operation.amount}</span>
			</p>
			<button onClick={handleEdit}>edit</button>
			<button onClick={handleDelete}>delete</button>
		</div>
	)
}

const UserDataHeader = ({ user, summary }) => {
	return (
		<div style={borderStyle}>
			<div>
				<img src={user.img} alt="user_profile" />
				<div>
					<h2>{user.username}</h2>
					<span>{user.email}</span>
				</div>
			</div>
			<p>estado de cuenta: ${summary}</p>
		</div>
	)
}

export const Home = () => {
	const { user, setUser } = useContext(UserContext)
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

	const handleLogout = () => {
		window.localStorage.removeItem('userData')
		setUser(undefined)
	}

	const handleAddOperation = async (operation) => {
		const newOperation = await service.sendOperation(operation)
		setOperations([...operations, newOperation])
		setUserSummary(userSummary + newOperation.amount)
	}

	const handleDeleteOperation = (id) => {
		const filterOperations = operations.filter(
			(operation) => operation.id !== id
		)
		setOperations(filterOperations)
		const newSummary = filterOperations.reduce(
			(tot, operation) => (tot += operation.amount),
			0
		)
		console.log(newSummary)
		setUserSummary(newSummary)
	}

	return (
		<>
			<h1>Home</h1>
			<UserDataHeader user={user} summary={userSummary} />
			<div>
				{operations.map((operation) => (
					<Operation
						operation={operation}
						key={operation.id}
						handleDeleteOperation={handleDeleteOperation}
					/>
				))}
			</div>
			<button onClick={handleLogout}> logout </button>
			<hr />
			<OperationForm handleAddOperation={handleAddOperation} />
		</>
	)
}
