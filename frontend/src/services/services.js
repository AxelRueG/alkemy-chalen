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

	config = () => {
		return {
			headers: {
				Authorization: this.token,
			},
		}
	}

	getOperations = async () => {
		const operations = await axios.get(
			`${this.URL}/v1/operations`,
			this.config()
		)
		return operations.data
	}

	sendOperation = async (operation) => {
		const response = await axios.post(
			`${this.URL}/v1/operations`,
			operation,
			this.config()
		)
		return response.data
	}

	setToken = (token) => (this.token = `Bearer ${token}`)
}

const service = new Services()

export default service
