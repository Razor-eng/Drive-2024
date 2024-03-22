import { useEffect, useState } from "react";
import Data from "./components/Data/Data"
import Header from "./components/Header/Header"
import Sidebar from "./components/Sidebar/Sidebar"
import Widgets from "./components/Widgets/Widgets"
import { auth, provider } from "./firebase";

function App() {
  const [selected, setSelected] = useState('Home');
  const [user, setUser] = useState(null);

  const signIn = () => {
    auth.signInWithPopup(provider).then((user) => {
      setUser(JSON.stringify({
        email: user.user.email,
        name: user.user.displayName,
        photoURL: user.user.photoURL
      }));
      localStorage.setItem('user', JSON.stringify({
        email: user.user.email,
        name: user.user.displayName,
        photoURL: user.user.photoURL
      }));
    }).catch(error => {
      alert(error.message);
    })
  }

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  return (
    <>
      {
        !user ? (
          <div className="login">
            <div>
              <img src="/drive.png" alt="" />
              <button onClick={signIn}>Sign in with Google</button>
            </div>
          </div>
        ) : (
          <>
            <Header user={user} setUser={setUser} />
            <div className="App">
              <Sidebar setSelected={setSelected} selected={selected} user={user} />
              <Data selected={selected} user={user} />
              <Widgets />
            </div>
          </>
        )
      }
    </>
  )
}

export default App
