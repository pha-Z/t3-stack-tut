import type { PropsWithChildren } from "react";

export const Container = (props: PropsWithChildren) => (
  <main className="flex h-screen w-screen justify-center">
    <div className="container min-w-fit overflow-y-scroll border-x border-slate-400 md:max-w-2xl">
      {props.children}
    </div>
  </main>
);
