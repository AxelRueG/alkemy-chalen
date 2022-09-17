export const UserDataHeader = ({ user, summary }) => {
	return (
		<div>
			<div>
				<img src={user.img} alt="user_profile" />
				<div>
					<h2>{user.username}</h2>
					<span>{user.email}</span>
				</div>
			</div>
			<p>estado de cuenta: ${summary}</p>
		</div>
	)
}
