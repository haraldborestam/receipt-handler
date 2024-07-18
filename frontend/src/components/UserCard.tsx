import SupportIcon from "/support-icon.svg";
import LogoutIcon from "/logout-icon.svg";
import SettingsIcon from "/settings-icon.svg";

function UserCard() {
  return (
    <div className="user-card">
      <h2>Harald</h2>
      <ul>
        <li className="margin-left-3em">
          <img src={SupportIcon} className="small-icon" />
          Support
        </li>
        <li className="margin-left-3em">
          <img src={SettingsIcon} className="small-icon" />
          Settings
        </li>
        <li className="margin-left-3em">
          <img src={LogoutIcon} className="small-icon" />
          Logout
        </li>
      </ul>
      <p className="small-link-text">Terms</p>
    </div>
  );
}

export default UserCard;
