import { Stack, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import * as React from 'react';
import Legend from './Legend';

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

const legendData = [
    {
        label: 'Essentials',
        color: '#37ABFF'
    },
    {
        label: 'Average Sellers',
        color: '#FFF7DB'
    },
    {
        label: 'Slow Sellers',
        color: '#E0FFDB'
    },
    {
        label: 'Hot Sellers',
        color: '#FFDBDB'
    }
]

export const Sections = () => {

    const minDate = new dayjs();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container>
                <Grid item xs={12} sx={{ marginBottom: 2 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        sx={{ pl: 4, pr: 4 }}
                    >
                        <Stack direction={'column'}>
                            <Typography variant='h6'>Pick a date to get suggestion</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Select Date"
                                    renderInput={(params) => <TextField {...params} />}
                                    minDate={minDate}
                                />
                            </LocalizationProvider>
                        </Stack>

                        <Legend data={legendData}></Legend>
                    </Stack>
                </Grid>
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