const Error = () => {
    return (
      <div className="fixed right-0 top-0 bottom-0 left-0 bg-[#007BFF] flex flex-col justify-center items-center text-white text-3xl gap-5">
        <p>An error has occurred ☹️</p>
        <p>Please try to refresh the page</p>
        <button onClick={() => window.location.reload()} className="text-base bg-white text-[#007BFF] px-5 py-2 rounded-md">RELOAD PAGE</button>
      </div>
    );
  };
  
  export default Error;
  