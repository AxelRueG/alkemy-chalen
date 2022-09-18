export const Message = ({ message }) => {
	const vecStr = message.split(' ')
	const style = vecStr[vecStr.length - 1] === 'successfully' ? 'success' : 'danger'

	return <div className={style}>{message}</div>
}
