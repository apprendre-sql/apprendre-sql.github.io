import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ResultsTable from "./results";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Editor from "@monaco-editor/react";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, AlertColor } from "@mui/material";

var equal = require("fast-deep-equal/es6/react");

export default ({ name, db, question, answer }): JSX.Element => {
    const [request, setRequest] = useState("");
    const [result, setResult] = useState<null | any[]>(null);
    const [expected, setExpected] = useState<null | any[]>(null);
    const [verdict, setVerdict] = useState(0);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const action = (
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
    );
    let severity: AlertColor = "success";
    let message = "Correct !";
    if (error) {
        severity = "error";
        message = "Erreur : " + error;
    }
    else if (verdict === 0) {
        severity = "warning";
        message = "Mauvais résultat.";
    }
    return (
        <Box mb={4} key={name}>
            <Grid container justifyContent="center" alignItems="center" sx={{ m: 2, fontWeight: 'bold' }}>
                {question}
            </Grid>
            <Snackbar open={open} autoHideDuration={6000} action={action}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <Grid
                spacing={2}
                mb={5}
                container
                justifyContent="center"
                alignItems="center"
            >
                <Grid item md={10} sm={10} xs={12}>
                    <Box sx={{ border: 1, width: "100%" }} p={0.5}>
                        <Editor
                            height="13vh"
                            defaultLanguage="sql"
                            onChange={(e) => setRequest(e)}
                            options={{
                                lineNumbers: "off",
                                minimap: {
                                    enabled: false,
                                },
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item>
                    <Button
                        size="large"
                        variant="contained"
                        color="success"
                        onClick={() => {
                            try {
                                let expected = db.exec(answer);
                                let r = db.exec(request);
                                setResult(r);
                                setExpected(expected);
                                setVerdict(equal(r[0].values, expected[0].values) ? 1 : 0);
                            } catch (err) {
                                console.log(err);
                                setError(err.message);
                            }
                            setOpen(true);
                        }}
                    >
                        Valider
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={6} direction="row">
                {result && (
                    <Grid item md={5} xs={12}>
                        <Typography align="center">
                            Résultat de votre requête <br></br>
                            {result.map(({ columns, values }) => (
                                <ResultsTable columns={columns} values={values} />
                            ))}
                        </Typography>
                    </Grid>
                )}
                {expected && (
                    <Grid item md={5} xs={12}>
                        <Typography align="center">
                            Résultat attendu <br></br>
                            {expected.map(({ columns, values }) => (
                                <ResultsTable columns={columns} values={values} />
                            ))}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};
