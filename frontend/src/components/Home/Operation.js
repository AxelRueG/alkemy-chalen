import { useNavigate } from 'react-router-dom'
import service from '../../services/services'

export const Operation = ({ operation, handleDeleteOperation }) => {
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
		<div>
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
