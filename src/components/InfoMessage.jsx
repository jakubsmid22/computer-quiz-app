
const InfoMessage = ({infoMessage}) => {

    const {score, message} = infoMessage;

  return (
    <h1 className="text-xl">
        <span className="font-bold text-3xl mr-3">{score}%</span> {message}
    </h1>
  )
}

export default InfoMessage