import { useNavigate } from 'react-router-dom'
import service from '../../services/services'

export const Operation = ({ operation, handleDeleteOperation }) => {
	const navigate = useNavigate()

	const handleDelete = async () => {
		const confirmStatus = window.confirm(`Are you sure you want to delete: ${operation.title}`)
		if (confirmStatus) {
			try {
				await service.deleteOperation(operation.id)
				handleDeleteOperation(operation.id)
			} catch {
				alert('something')
			}
		}
	}

	const handleEdit = () => navigate(`/operation/${operation.id}`)

	const humanizate = (date) => {
		const oDate = new Date(date)
		return `${oDate.getDate()}/${oDate.getMonth()}/${oDate.getFullYear()}`
	}

	return (
		<div className="operation-container">
			<div className="operation-header">
				<img src={operation.img} alt="category" />
				<div className="operation-header-info">
					<h3>{operation.title}</h3>
					<p className="operation-header-description">{humanizate(operation.pub_date)}</p>
					<p className="operation-header-description">{operation.description}</p>
					<p className="operation-header-amount">
						$
						<span className={operation.amount < 0 ? 'amount-negative' : ''}>
							{operation.amount}
						</span>
					</p>
					<div className="operation-header-buttons">
						<button onClick={handleEdit} className="operation-buttons-edit">
							<i className="fa fa-pen"></i>
						</button>
						<button onClick={handleDelete} className="operation-buttons-delete">
							<i className="fa fa-trash"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
