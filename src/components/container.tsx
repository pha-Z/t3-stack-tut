import type { PropsWithChildren } from "react";

export const Container = (props: PropsWithChildren) => (
  <div className="container items-center border-x border-zinc-700 md:max-w-2xl">
    {props.children}
  </div>
);
