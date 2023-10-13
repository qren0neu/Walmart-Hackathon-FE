import { Box, Stack, TextField } from '@mui/material';
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
    // console.log(props.data);
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
            {!props.data && <Typography sx={{ color: '#000000D8' }} variant="h5">{props.title}</Typography>}
            {
                props.data &&
                (
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        {
                            Object.keys(props.data['Dept Desc']).map((key, idx) => {
                                const category = key;
                                const sales = props.data['Dept Desc'][key]['SALES'].toFixed(2);
                                return <Box key={idx} sx={{ padding: 0.5 }}>
                                    <Stack direction={'column'} alignItems={'center'}>
                                        <Typography sx={{ fontSize: '11px' }}>{`Category: ${category}`}</Typography>
                                        <Typography sx={{ fontSize: '11px' }}>{`Sales: ${sales}`}</Typography>
                                    </Stack>
                                </Box>
                            })
                        }
                    </Stack>
                )
            }
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

    const [selectedDate, setSelectedDate] = React.useState(null);
    const [predictData, setPredictData] = React.useState(null);

    const sendAPI = (year, week) => {

        const URL = `${process.env.REACT_APP_API_URL}/api/callmodel`;

        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                year, week
            })
        }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                setPredictData(data);
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const getWeekNumber = (date) => {
        const target = dayjs(date); // Convert the input to a Day.js object
        target.set('hour', 0);
        target.set('minute', 0);
        target.set('second', 0);
        target.set('millisecond', 0);
        target.subtract(target.day() >= 3 ? 3 : -4, 'day');
        const week1 = dayjs(target).set('month', 0).set('date', 4);
        return target.diff(week1, 'week') + 1;
    }

    const handleDateChange = (date) => {
        console.log('On Date Change');

        setSelectedDate(date);
        // send post req
        const week = getWeekNumber(date);
        const year = dayjs(date).year();
        // TODO: remove test code
        sendAPI(year, week);
    };

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
                            <Typography sx={{ mb: 2 }} variant='h6'>Pick a date to get suggestion</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Select Date"
                                    onChange={handleDateChange}
                                    value={selectedDate}
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
                    <CategoryCard title="Average Sellers" backgroundColor="#FFF7DB" data={predictData?.result['Category Type']['Slower Sellers']} />
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