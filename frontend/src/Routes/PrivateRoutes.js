import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

export const PrivateRoutes = ({ children }) => {
	const { user } = useContext(UserContext)

	if (!user) return <Navigate to="/login" />
	return children
}
