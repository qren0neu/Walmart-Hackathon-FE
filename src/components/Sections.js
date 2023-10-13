import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const defaultPaperStyle = {
    p: 2,
    display: 'flex',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    flexDirection: 'column',
    boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0)', // Customize the specific shadow here
};

const CategoryCard = (props) => {
    return (
        <Paper
            sx={{
                ...defaultPaperStyle,
                backgroundColor: props.backgroundColor ? props.backgroundColor : 'white'
            }}
            onClick={() => {
                // Handle click, maybe navigate to another page or open modal
            }}
        >
            <Typography sx={{ color: '#000000D8' }} variant="h5">{props.title}</Typography>
        </Paper>
    );
}

export const Sections = () => {
    return (

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container>
                {/* ================ L Section Title ================ */}
                <Grid item xs={12}>
                    <Paper sx={{
                        ...defaultPaperStyle,
                        borderBottomLeftRadius: 0,
                        backgroundColor: '#37ABFF',
                    }}>
                        <Typography sx={{ color: 'white' }} variant="h5">Essentials</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={2}>
                    <Paper sx={{
                        ...defaultPaperStyle,
                        borderRadius: 0,
                        height: 150,
                        backgroundColor: '#37ABFF',
                    }}>
                    </Paper>
                </Grid>
                <Grid item xs={1.5} />
                <Grid item xs={7} sx={{
                    marginTop: 3.5,
                }}>
                    <CategoryCard title="Average Sellers" backgroundColor="#FFF7DB" />
                </Grid>

                <Grid item xs={2}>
                    <Paper sx={{
                        ...defaultPaperStyle,
                        borderRadius: 0,
                        height: 150,
                        backgroundColor: '#37ABFF',
                    }}>
                    </Paper>
                </Grid>
                <Grid item xs={1.5} />
                <Grid item xs={7} sx={{
                    marginTop: 3.5,
                }}>
                    <CategoryCard title="Slow Sellers" backgroundColor="#E0FFDB" />
                </Grid>

                <Grid item xs={2}>
                    <Paper sx={{
                        ...defaultPaperStyle,
                        borderRadius: 0,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        height: 150,
                        backgroundColor: '#37ABFF',
                    }}>
                    </Paper>
                </Grid>
                <Grid item xs={1.5} />
                <Grid item xs={7} sx={{
                    marginTop: 3.5,
                }}>
                    <CategoryCard title="Hot Sellers" backgroundColor="#FFDBDB" />
                </Grid>

            </Grid>
        </Container>
    )
}