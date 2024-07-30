const Answer = ({ answer, onClick, styleClass }) => {
  return (
      <p onClick={() => onClick(answer)} className={styleClass}>
          {answer}
      </p>
  );
}

export default Answer;
