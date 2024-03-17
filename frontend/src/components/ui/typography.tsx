type TypographyProps = { children: React.ReactNode };

export function H1({ children }: Readonly<TypographyProps>) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
}

export function H2({ children }: Readonly<TypographyProps>) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export function H3({ children }: Readonly<TypographyProps>) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export function P({ children }: Readonly<TypographyProps>) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}
