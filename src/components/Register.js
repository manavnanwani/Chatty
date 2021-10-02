import React, { useState } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { auth, firestore } from "../Firebase/index";
import { useHistory } from "react-router";

import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const Register = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [messageSnack, setMessageSnack] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const handleClick = () => {
    setOpenSnack(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  const register = (event) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        var user = result.user;
        user
          .updateProfile({
            displayName: `${fName} ${lName}`,
          })
          .then(() => {
            sessionStorage.setItem("userId", user.uid);
            sessionStorage.setItem("userEmail", user.email);
            sessionStorage.setItem("userName", user.displayName);
            setMessage("");
            setEmail("");
            setPassword("");
            setFName("");
            setLName("");
            setPhone("");
            setMessageSnack("Registered");
            handleClick();
            firestore
              .collection("Users")
              .doc(user.uid)
              .set({
                id: user.uid,
                name: user.displayName,
                phone: phone,
                chats: [],
              })
              .then(() => {
                console.log("Document successfully written!");
              })
              .catch((error) => {
                console.error("Error writing document: ", error);
              });
            history.push("/");
          });
      })

      .catch(function (error) {
        var errorMessage = error.message;
        setMessage(errorMessage);
      });
  };

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      border: "1px solid grey",
      borderRadius: "10px",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: "#f50057 !important",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: "10px 0 !important",
    },
  }));

  const classes = useStyles();

  return (
    <Container maxWidth="xs">
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnack}
        autoHideDuration={2000}
        onClose={handleClose}
        message={messageSnack}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />

      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={fName}
                onChange={(e) => setFName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lName}
                onChange={(e) => setLName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <p style={{ color: "red", fontSize: "12px", textAlign: "right" }}>
            {message}
          </p>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={register}
            size="large"
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                onClick={() => history.push("/login")}
                variant="body2"
                style={{ cursor: "pointer", textDecoration: "none" }}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Register;
