import { Container, Grid, Typography } from "@mui/material";

export const HistoryReport = ({ imgPath, alt = "" }) => {
    function CenteredImage() {
        return (
            <Container>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Grid item>
                        <Typography variant="h6">{alt}</Typography>
                    </Grid>
                    <Grid item sx={{ marginTop: 2 }}>
                        <img
                            src={imgPath}
                            alt={alt}
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <CenteredImage />
    )
}