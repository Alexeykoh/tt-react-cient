import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen p-2 lg:p-0  bg-auto bg-center bg-no-repea bg-[url(https://images.unsplash.com/photo-1678282514430-1350ec121314?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]">
      {children}
    </div>
  );
};

export default AuthLayout;
