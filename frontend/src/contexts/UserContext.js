import { useState, createContext } from 'react'

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
	const [user, setUser] = useState(undefined)
	const value = { user, setUser }

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
