import axios from 'axios'

class Services {
	URL = 'http://localhost:3000'
	token = undefined

	login = async (username, password) => {
		const responseUser = await axios.post(`${this.URL}/login`, {
			username,
			password,
		})
		return responseUser.data
	}

	setToken = (token) => (token = `Bearer ${token}`)
}

const service = new Services()

export default service
