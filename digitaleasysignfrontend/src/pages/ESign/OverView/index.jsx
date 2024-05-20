import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RecentTable from './RecentTable';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Index = (props) =>{
    return (
        <>
        <Box mt={3}>
            <Grid container spacing={2}>
                <Grid item lg={7} xs={12}>
                    <Card elevation={0}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 1.8,
                            }}
                        >
                            <Box display='flex' alignItems='center'>
                                <Box
                                    display='flex'
                                    alignItems='center'
                                    mr={2}
                                >
                                    <BackupTableIcon
                                        fontSize='small'
                                        sx={{ color: '#4B356B' }}
                                    />
                                    <Typography
                                        sx={{ ml: 1 }}
                                        variant='body2'
                                    >
                                        Combine files
                                    </Typography>
                                </Box>
                                <Box display='flex' alignItems='center'>
                                    <RateReviewIcon
                                        fontSize='small'
                                        sx={{ color: '#F539F5' }}
                                    />
                                    <Typography
                                        sx={{ ml: 1 }}
                                        variant='body2'
                                    >
                                        Request e-signatures
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display='flex' alignItems='center'>
                                <Button
                                    variant='outlined'
                                    size='small'
                                    sx={{ borderRadius: '12px', mr: 2 }}
                                >
                                    See all tools
                                </Button>
                                <MoreHorizIcon fontSize='small' />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={5} xs={12}>
                    <Card elevation={0}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <Typography variant='body2'>
                                    Get documents signed fast
                                </Typography>
                                <Typography
                                    variant='caption'
                                    color='#3B84D9'
                                >
                                    Request e-signatures
                                </Typography>
                            </Box>
                            <Box>
                                <MoreHorizIcon fontSize='small' />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
        <Box mt={3}>
            <Grid container spacing={4} display='flex' alignItems='center'>
                <Grid item xs>
                    <Typography variant='h6'>Recent</Typography>
                </Grid>

                <Grid
                    item
                    sx={{ display: { xs: 'flex' }, mx: 'auto' }}
                    alignItems='center'
                >
                    <Box>
                        <Tooltip title='Thumbnail view' placement='bottom'>
                            <IconButton
                                disableRipple
                                variant='navIcon'
                                sx={{ mr: 1 }}
                            >
                                <FormatListBulletedIcon fontSize='small' />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box>
                        <Tooltip title='More' placement='bottom'>
                            <IconButton
                                disableRipple
                                variant='navIcon'
                                sx={{ mr: 0 }}
                            >
                                <GridViewOutlinedIcon fontSize='small' />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Grid>
            </Grid>
        </Box>
        <Box mt={3}>
            <Card elevation={0}>
                <CardContent>
                    <RecentTable />
                </CardContent>
            </Card>
        </Box>
    </>
    );
}

export default Index;