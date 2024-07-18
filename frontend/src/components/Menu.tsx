import { useState } from "react";
import UserCard from "./UserCard";
import Logo from "/receipt-logo-pop.svg";
import UserIcon from "/user-icon.svg";

function Menu() {
  const [isUserCardVisible, setIsUserCardVisible] = useState(false);

  const toggleUserCard = () => {
    setIsUserCardVisible((prev) => !prev);
  };

  return (
    <>
      <header className="menu-header">
        <div className="header-left">
          <img src={Logo} alt="Receipt logo" />
        </div>
        <div className="header-right">
          <img
            src={UserIcon}
            alt="User icon"
            className="user-icon"
            onClick={toggleUserCard}
          />
          {isUserCardVisible && <UserCard />}
        </div>
      </header>
    </>
  );
}

export default Menu;
