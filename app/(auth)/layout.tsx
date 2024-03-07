const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-full flex items-center justify-center pt-40">
      {children}
    </div>
  );
}

export default AuthLayout;

// Modify the layout to add a slider or anything to this page.