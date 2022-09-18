export const UserDataHeader = ({ user, summary }) => {
	return (
		<div className="user">
			<img src={user.img} alt="user_profile" className="user-img" />
			<div className="user-data">
				<p>
					<strong>{user.username.toUpperCase()}</strong>
				</p>
				<p className="user-data-email">{user.email}</p>
				<p>account status: ${summary}</p>
			</div>
		</div>
	)
}
