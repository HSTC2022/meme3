import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';

import {history} from '_helpers';
import {Layout, CheckAuthenticated} from '_components';
import {Home} from 'pages/home';
import {PageNotFound} from 'pages/PageNotFound';
import {
  UserAbout,
  UserMeme,
  UserNft,
  UserUpdate
} from 'pages/user';
import {PostMeme} from 'pages/post'

export {App};
function App() {
  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:id" element={<PostMeme />}/>
        <Route path="/user-about" element={<CheckAuthenticated><UserAbout/></CheckAuthenticated>}/>
        <Route path="/user-nft" element={<CheckAuthenticated><UserNft/></CheckAuthenticated>}/>
        <Route path="/user-meme" element={<CheckAuthenticated><UserMeme/></CheckAuthenticated>}/>
        <Route path="/user-update" element={<CheckAuthenticated><UserUpdate/></CheckAuthenticated>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </Layout>
  );
}
