const getChildren = (children: JSX.Element[] | JSX.Element) => {
  if (Array.isArray(children)) {
    return children;
  }

  return [children];
};

export default function Main({
  children,
  className,
}: {
  children: JSX.Element[] | JSX.Element;
  className?: string;
}) {
  return (
    <main
      className={`flex justify-center items-center h-screen w-full bg-muted/40 ${className}`}
    >
      {...getChildren(children)}
    </main>
  );
}
