import { SignIn } from "@clerk/nextjs";

export const SignInViewPage = () => {
  return <SignIn routing="hash" />;
};
