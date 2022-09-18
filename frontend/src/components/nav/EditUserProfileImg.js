import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import service from '../../services/services'
import { Message } from '../Message'
import './navStyle.css'

const ProfileImage = ({ img, imgID, handleSelect }) => {
	const cssClassImgSelected = imgID === img.id ? 'img-selected' : ''

	return (
		<div className={`profile-image ${cssClassImgSelected}`}>
			<img src={img.img_url} alt="image_profile" onClick={() => handleSelect(img.id)} />
		</div>
	)
}

export const EditUserProfileImg = () => {
	const { user, setUser } = useContext(UserContext)

	const [imgs, setImgs] = useState([])
	const [imgID, setImgID] = useState(1)
	const [message, setMessage] = useState('')

	useEffect(() => {
		service
			.getListImages()
			.then((response) => {
				setImgs(response)
				const currentImgId = response.find((i) => i.img_url === user.img)
				setImgID(currentImgId.id)
			})
			.catch((error) => console.error(error.message))
	}, [user])

	const handleSelect = (id) => setImgID(id)

	const handleSubmit = async () => {
		try {
			// update in DB
			await service.updateUserProfileImage({ id_img: imgID })
			// find the category image url
			const imgUrl = imgs.find((img) => img.id === imgID)
			// and replace old url
			const userUdapted = { ...user, img: imgUrl.img_url }
			window.localStorage.removeItem('userData')
			// save new user data
			window.localStorage.setItem('userData', JSON.stringify(userUdapted))
			setMessage('profile update successfully')
			setUser(userUdapted)
		} catch (error) {
			console.log(error.message)
			setMessage('could not change profile picture')
		}
	}

	return (
		<div className="container image-container">
			<p className="operation-form-title">Select your new ProfileImage:</p>
			<div className="image-container-images">
				{message !== '' && <Message message={message} />}
				{imgs.map((img) => (
					<ProfileImage key={img.id} img={img} imgID={imgID} handleSelect={handleSelect} />
				))}
			</div>
			<button className="image-container-button" onClick={handleSubmit}>
				change
			</button>
		</div>
	)
}
