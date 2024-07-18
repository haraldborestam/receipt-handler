import Logo from "/receipt-logo-pop.svg";
import UserIcon from "/user-icon.svg";

function Menu() {
  return (
    <>
      <header>
        <div className="header-left">
          <img src={Logo} alt="Receipt logo" />
        </div>
        <div className="header-right">
          <img src={UserIcon} alt="User icon" className="user-icon" />
        </div>
      </header>
    </>
  );
}

export default Menu;
