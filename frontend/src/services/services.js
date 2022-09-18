import axios from 'axios'

class Services {
	URL = 'http://localhost:3000'
	// URL = '' // this is for build
	token = undefined

	// --- config and setting services ------------------------------------
	setToken = (token) => (this.token = `Bearer ${token}`)

	config = () => {
		return {
			headers: {
				Authorization: this.token,
			},
		}
	}

	// --- access ---------------------------------------------------------
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

	// --- operations -----------------------------------------------------
	getOperations = async () => {
		const operations = await axios.get(`${this.URL}/v1/operations`, this.config())
		return operations.data
	}

	sendOperation = async (operation) => {
		const response = await axios.post(`${this.URL}/v1/operations`, operation, this.config())
		return response.data
	}

	deleteOperation = async (id) => {
		await axios.delete(`${this.URL}/v1/operations/${id}`, this.config())
	}

	getOnlyOperation = async (id) => {
		const response = await axios.get(`${this.URL}/v1/operations/${id}`, this.config())
		return response.data
	}

	updateOperation = async (id, operation) => {
		const response = await axios.put(`${this.URL}/v1/operations/${id}`, operation, this.config())
		return response.data
	}

	// --- user ----------------------------------------------------------
	getUserSummary = async () => {
		const response = await axios.get(`${this.URL}/v1/user`, this.config())
		return response.data
	}

	updateUserProfileImage = async (data) => {
		await axios.put(`${this.URL}/v1/user/image`, data, this.config())
	}

	updateUSerPassword = async (data) => {
		await axios.put(`${this.URL}/v1/user/password`, data, this.config())
	}

	// --- others conections ---------------------------------------------
	getListImages = async () => {
		const response = await axios.get(`${this.URL}/v1/images_profile`)
		return response.data
	}

	getListCategories = async () => {
		const response = await axios.get(`${this.URL}/v1/categories`)
		return response.data
	}
}

const service = new Services()

export default service
