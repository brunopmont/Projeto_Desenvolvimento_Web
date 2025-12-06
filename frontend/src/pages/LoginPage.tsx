import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h5>Página de Login</h5>
        <hr className="mt-1" />
      </div>

      {/* Renderiza o formulário */}
      <LoginForm />
    </div>
  );
};

export default LoginPage;