import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Backdrop from "@material-ui/core/Backdrop";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "absolute",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  guessButton: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  resultScreen: {
    color: "pink",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = require("./mapstyle.json");

export default function FullScreenDialog(props) {
  const center = {
    lat: 35.52985708763884,
    lng: -38.88253828198088,
  };
  const mapContainerStyle = {
    height: "100vh",
    width: "100vw",
  };
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSavedZoom(mapRef.current.getZoom());
    setSavedCenter({
      lat: mapRef.current.getCenter().lat(),
      lng: mapRef.current.getCenter().lng(),
    });
    setOpen(false);
  };

  const [savedCenter, setSavedCenter] = React.useState(center);
  const [savedZoom, setSavedZoom] = React.useState(3);
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const [guessMarker, setGuessMarker] = React.useState(null);
  const [currentPosition, setCurrentPosition] = React.useState(props.pos);
  const [currentPositionMarker, setCurrentPositionMarker] = React.useState(
    props.pos
  );
  const [showResult, setShowResult] = React.useState(false);
  const [points, setPoints] = React.useState(0);
  const [currentRound, setCurrentRound] = React.useState(1);
  const [pointsGiven, setPointsGiven] = React.useState(0);
  const [currentDistance, setDistance] = React.useState(0);
  const [gameFinished, setGameFinished] = React.useState(false);

  function deg2rad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  const calculateDistance = (latitude1, longitude1, latitude2, longitude2) => {
    var earthRadius = 6371; // Radius of the earth in km
    var dLat = deg2rad(latitude2 - latitude1); // deg2rad below
    var dLon = deg2rad(longitude2 - longitude1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(latitude1)) *
        Math.cos(deg2rad(latitude2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = earthRadius * c;
    return d;
  };

  const givePoints = (distance) => {
    let maxDistance = 100;
    if (distance > maxDistance) return 0;
    let result = 50 * Math.floor(maxDistance - distance);
    setPoints(points + result);
    return result;
  };

  const handleGuess = () => {
    if (guessMarker === null) return;
    let result = calculateDistance(
      guessMarker.lat,
      guessMarker.lng,
      currentPosition.lat,
      currentPosition.lng
    );
    setDistance(result);
    let thisQpoints = givePoints(result);
    setPointsGiven(thisQpoints);
    setCurrentPositionMarker(currentPosition);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentRound === 5) {
      setGameFinished(true);
      return;
    }
    let nextPlace = props.updatePos();
    setOpen(false);
    setSavedCenter(center);
    setGuessMarker(null);
    setCurrentPosition(nextPlace);
    setCurrentPositionMarker(nextPlace);
    setShowResult(false);
    setDistance(0);
    setCurrentRound(currentRound + 1);
  };

  const newGame = () => {
    let nextPlace = props.updatePos();
    setOpen(false);
    setSavedCenter(center);
    setGuessMarker(null);
    setCurrentPosition(nextPlace);
    setCurrentPositionMarker(nextPlace);
    setShowResult(false);
    setDistance(0);
    setCurrentRound(0);
    setPoints(0);
    setGameFinished(false);
    props.clearPositions();
  };

  return (
    <>
      {gameFinished ? (
        <div>
          <Backdrop open={true} className={classes.resultScreen}>
            <Typography variant="h3" className={classes.title}>
              {" "}
              Game finished! You got {points}/20000 points!{" "}
            </Typography>
            <Button
              onClick={newGame}
              style={{
                width: "30vw",
                fontSize: "1.2rem",
                marginRight: "1.5rem",
              }}
              variant="contained"
              color="primary"
            >
              Play again
            </Button>
          </Backdrop>
        </div>
      ) : (
        <div>
          <Button
            style={{
              width: "30vw",
              fontSize: "1.2rem",
            }}
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
          >
            Click to make guess
          </Button>
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                {showResult ? (
                  <Typography variant="h6" className={classes.title}>
                    You received {pointsGiven} points, your guess was{" "}
                    {currentDistance.toFixed(2) * 1000}m away from target!
                  </Typography>
                ) : (
                  <Typography variant="h6" className={classes.title}>
                    Click anywhere on the map to make your guess!
                  </Typography>
                )}
                {showResult ? (
                  <Button
                    autoFocus
                    color="inherit"
                    onClick={handleNextQuestion}
                    className={classes.guessButton}
                  >
                    continue{" "}
                  </Button>
                ) : (
                  <Button
                    autoFocus
                    color="inherit"
                    onClick={handleGuess}
                    className={classes.guessButton}
                  >
                    make guess
                  </Button>
                )}
                <Typography variant="h6">
                  Round {currentRound}/5 <br />
                  Points {points}
                </Typography>
              </Toolbar>
            </AppBar>
            <GoogleMap
              options={{ disableDefaultUI: true, styles: styles.alt }}
              mapContainerStyle={mapContainerStyle}
              center={savedCenter}
              zoom={savedZoom}
              clickableIcons={false}
              onLoad={onMapLoad}
              onClick={(event) => {
                if (showResult) return;
                setGuessMarker({
                  lat: event.latLng.lat(),
                  lng: event.latLng.lng(),
                });
              }}
            >
              <Marker
                position={guessMarker}
                icon={{
                  url: "/guess.svg",
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                }}
                title={"Your guess"}
              ></Marker>
              <Marker
                position={currentPositionMarker}
                visible={showResult}
                icon={{
                  url: "/correct.svg",
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                }}
                title={"Correct answer"}
              ></Marker>
              {showResult ? (
                <Polyline
                  path={[guessMarker, currentPositionMarker]}
                  visible={showResult}
                ></Polyline>
              ) : null}
            </GoogleMap>
          </Dialog>
        </div>
      )}
    </>
  );
}
