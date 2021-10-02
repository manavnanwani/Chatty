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
import { auth } from "../Firebase/index";

import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    alignItems: "center",
    border: "1px solid grey",
    borderRadius: "10px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#f50057 !important",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: "10px 0 !important",
  },
}));

export default function Login() {
  const history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const loginUser = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        auth.onAuthStateChanged(async function (user) {
          if (user) {
            sessionStorage.setItem("userId", user.uid);
            sessionStorage.setItem("userEmail", user.email);
            sessionStorage.setItem("userName", user.displayName);
            setMessage("");
            history.push("/");
          }
        });
      })
      .catch(function (error) {
        var errorMessage = error.message;
        setMessage(errorMessage);
      });
  };

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
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

          <p style={{ color: "red", fontSize: "12px", textAlign: "right" }}>
            {message}
          </p>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={loginUser}
            size="large"
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link
                onClick={() => history.push("/register")}
                variant="body2"
                style={{ cursor: "pointer", textDecoration: "none" }}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
