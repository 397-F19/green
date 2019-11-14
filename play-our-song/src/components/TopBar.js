import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { reactContext } from '../utils/store';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  button:{
    margin: theme.spacing(1),
    marginLeft: -150,
    marginTop: 10,
    fontSize: 25,
  },
}));

//-----------------START OF SPOTIFY BACKEND SETUP--------------------
export const authEndpoint = 'https://accounts.spotify.com/authorize?';

const clientId = "690c30f6add5454c8a5660405b6b228c";
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-modify-public",
  "playlist-modify-private",
];


//-----------------END OF SPOTIFY BACKEND SETUP--------------------

//the token is the authorization token obtained by the Spotify api in app.js
//might be expired so the login button checks if the token is set
const TopBar = ({ token , profilePic, username}) => {
  const classes = useStyles();
  const ctx = React.useContext(reactContext);

  return(
    <div className={classes.root}>
      <AppBar position="static" >
        <Toolbar>
                <IconButton edge="start" color="inherit">
                <MusicNoteIcon fontSize="large" />
                </IconButton >
                <Typography className={classes.title} variant="h4">
                  PlayOurSong
                </Typography>
                <div className={classes.grow} />
                <Button className={classes.button} color="inherit" onClick={() => ctx.open[1](true)}>
                {ctx? ctx.playlistTitle[0]:''}
                </Button>
                <div className={classes.grow} />
                {!token && (
                  <IconButton  
                  href={`${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`} 
                  edge="end" 
                  aria-label="account of current user" 
                  color="inherit"
                  >
                    <AccountCircle fontSize="large" />
                  </IconButton>
                )}
                {token && (
                    <div>
                      <Avatar alt="Remy Sharp" src= {profilePic} />
                      {/* <span>
                        <Typography variant="button" display="block" gutterBottom>
                          {username}
                        </Typography>
                      </span>  */}
                    </div>
                )}
        </Toolbar>
      </AppBar>
    </div>
  )
};

export default TopBar;
