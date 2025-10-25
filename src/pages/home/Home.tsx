import React from "react";
import { Layout } from "./components/Layout";
import { Contests } from "./components/Contests";
import { Prizes } from "./components/Prizes";
import { Account } from "./components/Account";
import { getUserData } from "../../redux/user/selectors";
import { useSelector } from "react-redux";

export const Home: React.FC = () => {
  const { userData } = useSelector(getUserData);

  return (
    <>
      <Layout avatar={userData?.profile.avatar} fullName={userData?.fullName} />
      <Contests />
      <Prizes />
      <Account fullName={userData?.fullName} card={userData?.card} />
    </>
  );
};
