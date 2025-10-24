import React from "react";
import { Layout } from "./components/Layout";
import { Contests } from "./components/Contests";
import { Prizes } from "./components/Prizes";
import { Account } from "./components/Account";

export const Home: React.FC = () => {
  return (
    <>
      <Layout />
      <Contests />
      <Prizes />
      <Account />
    </>
  );
};
