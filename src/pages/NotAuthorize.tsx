

const NotAuthorized = () => {
    return (
      <div className=" bg-[var(--color-white)]" style={{ textAlign: "center", marginTop: "50px" }}>
        <h1 className="text-[var(--color-dark)]">403 - Not Authorized</h1>
        <p className="text-[var(--color-dark)]">You do not have permission to access this page.</p>
      </div>
    );
  };
  
  export default NotAuthorized;
  