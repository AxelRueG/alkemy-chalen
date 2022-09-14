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

	register = async (userRegisterData) => {
		try {
			const response = await axios.post(`${this.URL}/v1/user`, userRegisterData)
			return response.status
		} catch (error) {
			console.log(error.message)
			return null
		}
	}

	setToken = (token) => (token = `Bearer ${token}`)
}

const service = new Services()

export default service
