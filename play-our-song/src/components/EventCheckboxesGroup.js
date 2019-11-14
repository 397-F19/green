import React, {useState, useEffect} from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { reactContext } from '../utils/store';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	  },
	  formControl: {
		marginTop: theme.spacing(3),
	  },
}));

const EventCheckboxesGroup =() =>{
	const [checkboxState, setCheckboxState] = useState({});
	const [eventNames, setEventNames] = useState([]);
	const classes = useStyles();
	const ctx = React.useContext(reactContext);

	useEffect(() => {
		const fetchEventNames = async () => {
			const response = await fetch('./data/Event2Genre.json');
			const json = await response.json();
			console.log(json);
			const eventNames = Object.keys(json);
			setEventNames(eventNames);
			eventNames.forEach((eventName) => {
				checkboxState[eventName] = false;
			});
			setCheckboxState(checkboxState);
		};
		fetchEventNames();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = eventName => event => {
		let selectedPlaylistEvents = ctx.playlistEvents[0];
		if (selectedPlaylistEvents.indexOf(eventName) === -1) {
			selectedPlaylistEvents.push(eventName);
		}
		else {
			selectedPlaylistEvents
				= selectedPlaylistEvents.filter((x) => x !== eventName);
		}
		ctx.playlistEvents[1](selectedPlaylistEvents);

		console.log('handleChange - eventName', eventName);
		console.log('handleChange - selectedPlaylistEvents', selectedPlaylistEvents);
		console.log('handleChange - event.target.checked', event.target.checked);

		setCheckboxState({ ...checkboxState, [eventName]: event.target.checked });
	}

	return (
		<div className={ classes.root }>
			<FormControl component="fieldset" className={ classes.formControl }>
				<FormGroup>
					{
						eventNames.map(eventName => (
							<FormControlLabel
							 	control={
									<Checkbox checked={checkboxState[eventName]}
										onChange={handleChange(eventName)}
										value={eventName} />
								}
								label={eventName.toUpperCase()}/>
						))
					}
				</FormGroup>
			</FormControl>
		</div>
	);
}

export default EventCheckboxesGroup;
