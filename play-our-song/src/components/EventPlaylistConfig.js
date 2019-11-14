import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { reactContext } from '../utils/store';
import EventCheckboxesGroup from "./EventCheckboxesGroup";

// FIXME: These are meant to be removed.
var client_id = 'b1bcbd4ae171494db0dbd3a736535946'; // Your client id
var client_secret = '27127362e5174286a15516cc33a96998'; // Your secret
// var redirect_uri = 'http://www.google.com'; // Your redirect urib
// eslint-disable-next-line no-unused-vars
var user_id = 'p7x48c95ztmvh1ry6umg0h82f'
var SpotifyWebApi = require('spotify-web-api-node');
// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: 'http://www.example.com/callback'
});
spotifyApi.setAccessToken('BQBNXuIYqvAnjRf88UtATB6hNBydlF6KxmYicXJq2xjpHTmIrXt_8H-MOOShTAKndjlLYyFmOYMnsGf2eDocKGooXszvdQr46v385AcwLdNcPZi80Yx4XGcRzDlezQwq-RJoWlm_0zQWHOUKjNQd8PuBW12NGesaIDFvwVOom9Vc7F9k2TkoVV4Z8sJWnbs');


const EventPlaylistConfig = ({setTracks, userId, authToken, forceUpdate}) =>{
	const [eventToGenres, setEventToGenres] = useState({});
	// eslint-disable-next-line no-unused-vars
	const [playlistId, setPlaylistId] = useState(null);

	useEffect(() => {
		const fetchEventToGenresMapping = async () => {
			const response = await fetch('./data/Event2Genre.json');
			const json = await response.json();
			console.log(json);
			setEventToGenres(json);
		};
		fetchEventToGenresMapping();
	}, []);

	const ctx = React.useContext(reactContext);
	// console.log(ctx);

	const handleChange = () => event => {
    ctx.playlistTitle[1](event.target.value);
	};

	const handleGenerate = () => {
		console.log('handleGenerate clicked');
		console.log(ctx);
		ctx.open[1](false);
		// TODO: @Timo get form information
		const playlistTitle = ctx.playlistTitle[0];
		const playlistEvents = ctx.playlistEvents[0];
		const allGenresWithDuplications = playlistEvents.reduce(
			(acc, currEventName) => acc.concat(eventToGenres[currEventName]),
			[]);
		const genres = Array.from(new Set(allGenresWithDuplications));
		console.log(genres);
		getRecommendations(genres).then((trackRecs) => {
			createNewPlaylist(playlistTitle, trackRecs).then((pId) => {
				setTracks(trackRecs);
				addTracks(pId, trackRecs).then(data => {
					forceUpdate();
				});
			});
		});

		// TODO: @Timo add tracks to the new playlist
	};

	const addTracks = async (pId, trackRecs) => {
		console.log(`playlistid is ${pId}`);
		console.log("track recs from genre seeds:\n", trackRecs);
		const trackRecsStrings = trackRecs.map((trackRec) => `spotify:track:${trackRec.id}`);
		const endpoint = `https://api.spotify.com/v1/playlists/${pId}/tracks`;
		return await fetch(endpoint, {
			method: 'POST',
			headers: {
				Authorization: "Bearer " + authToken,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				'uris': trackRecsStrings,
			}),
		})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			return data;
		});
	};

	const createNewPlaylist = async (playlistTitle) => {
		// spotifyApi.createPlaylist(userId, playlistTitle);
		const endpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;
		console.log("authToken in createNewPlaylist:", authToken);
		console.log("playlistTitle in createNewPlaylist:", playlistTitle);
		return await fetch(endpoint, {
			method: 'POST',
			headers: {
				Authorization: "Bearer " + authToken,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
					'name': playlistTitle,
			}),
		})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			setPlaylistId(data.id);
			console.log(data.id);
			return data.id;
		});
	};

	const getRecommendations = async (genres) => {
		const genresAsString = genres.join(",");
		const endpoint = "https://api.spotify.com/v1/recommendations?seed_genres=" + genresAsString;
		return await fetch(endpoint, {
			method: 'GET',
			headers: {
				Authorization: "Bearer " + authToken,
			}
		}).then(response => response.json())
		.then(data => {
			return data.tracks;
		});
	};

	return (
    <div>
      <Dialog open={ctx? ctx.open[0]:false} onClose={() => ctx.open[1](false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Generate your playlist in one step</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To generate your playlist, please enter the title of your playlist and the type of your event.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Title"
        	onChange={handleChange()}
            fullWidth
          />
          <EventCheckboxesGroup/>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary"  onClick={() => handleGenerate()}>
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EventPlaylistConfig;
