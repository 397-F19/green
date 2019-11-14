import React, { useEffect, useState } from 'react';
import Playlist from './components/Playlist';
import TopBar from './components/TopBar';
import EventPlaylistConfig from './components/EventPlaylistConfig';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

//-----------------START OF SPOTIFY BACKEND SETUP--------------------


// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

window.location.hash = "";

//-----------------END OF SPOTIFY BACKEND SETUP--------------------

export const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
}));

const useForceUpdate = () => {
  const [value, set] = useState(true);
  console.log(value);
  return () => {
    console.log('Force updating...')
    set(value=> !value);
  };
}

const App = () =>  {
  const classes = useStyles();
  const [tracks, setTracks] = useState([]);
  const forceUpdate = useForceUpdate();
  const [tokens, setTokens] = useState();
  const [profilePic, setProfilePic] = useState();
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    // Set access token for spotify
    let _token = hash.access_token;
    if (_token) {
      setTokens(_token);
      console.log(_token);
    }
    setTracks(tracks);

    if (_token){
      fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + _token,
        }
      })
      .then(res => res.json())
      .then((data) => {
        //user information returned as a JSON file
        console.log(data);
        setProfilePic(data.images[0].url);
        setUsername(data.display_name);
        setUserId(data.id);
      })
      .catch(console.log)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
  <React.Fragment>
  <TopBar token={ tokens } username = {username} profilePic = {profilePic} className={classes.grow } />
  <Container maxWidth="lg" >
    <Playlist tracks={ tracks } />
  </Container>
  <EventPlaylistConfig setTracks={ setTracks } userId={ userId } authToken={ tokens } forceUpdate={ forceUpdate }/>
  </React.Fragment>

);}

export default App;
