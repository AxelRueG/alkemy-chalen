import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../contexts/UserContext'
import service from '../services/services'
import { OperationForm } from './OperationForm'

export const Home = () => {
	const { user, setUser } = useContext(UserContext)
	const [operations, setOperations] = useState([])

	useEffect(() => {
		service
			.getOperations()
			.then((response) => setOperations(response))
			.catch((error) => console.error(error.message))
	}, [])

	const handleLogout = () => {
		window.localStorage.removeItem('userData')
		setUser(undefined)
	}

	return (
		<>
			<h1>Home</h1>
			<p>Wellcome {user.username}</p>
			<ul>
				{operations.map((operation) => (
					<li key={operation.id}>{operation.title}</li>
				))}
			</ul>
			<button onClick={handleLogout}> logout </button>
			<hr />
			<OperationForm operations={operations} setOperations={setOperations} />
		</>
	)
}
