import { Apps, HelpOutline, OfflinePinOutlined, Search, SettingsOutlined, TuneRounded } from "@material-ui/icons"
import "./Header.css"
import { Avatar } from "@material-ui/core"
import { auth } from "../../firebase"

// eslint-disable-next-line react/prop-types
const Header = ({ user, setUser }) => {
    const signOut = () => {
        auth.signOut();
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <div className='header'>
            <div className="header_logo">
                <img src="/drive.png" alt="" />
                <span>Drive</span>
            </div>
            <div className="header_search">
                <Search />
                <input type="text" placeholder="Search in Drive" />
                <TuneRounded />
            </div>
            <div className="header_icons">
                <span>
                    <OfflinePinOutlined />
                    <HelpOutline />
                    <SettingsOutlined />
                    <Apps />
                </span>
                {/* eslint-disable-next-line react/prop-types */}
                <Avatar src={user?.photoURL} style={{ cursor: "pointer" }} onClick={signOut} />
            </div>
        </div>
    )
}

export default Header