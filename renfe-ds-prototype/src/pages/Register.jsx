import Container from "../ui/atoms/Container/Container.jsx";
import PageStack from "../ui/atoms/PageStack/PageStack.jsx";
import RegisterForm from "../ui/organisms/RegisterForm/RegisterForm.jsx";

export default function Register() {
  return (
    <Container as="section">
      <PageStack className="register" align="stretch" textAlign="left">
        <RegisterForm />
      </PageStack>
    </Container>
  );
}
