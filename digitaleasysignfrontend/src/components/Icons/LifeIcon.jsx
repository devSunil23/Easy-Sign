import { Grid, Typography, Box } from '@mui/material';
import React from 'react';
import { Images } from '../Image';

const LifeIcon = () => {
    return (
        <>
            <Box mt={1}>
                <Grid container alignItems='center' spacing={2} rowSpacing={5}>
                    <Grid
                        item
                        //   lg={4}
                        md={1.5}
                        sm={3}
                        xs={4}
                        mb={2}
                    >
                        <Box
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                        >
                            {/* <MuiLink
                                          href={app.url}
                                          target='_blank'
                                          sx={{
                                              fontWeight: 500,
                                              textDecoration: 'none',
                                              color: '#5f6368',
                                          }}
                                      > */}
                            <Images
                                src={'keptUp.jpg'}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '30px',
                                    width: '30px',
                                }}
                            />
                            {/* </MuiLink> */}
                        </Box>

                        <Typography
                            color='text.secondary'
                            variant='body2'
                            sx={{
                                textAlign: 'center',
                                textTransform: 'capitalize',
                                fontSize: '13px',
                                overflowX: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: 500,
                                mt: 1.5,
                            }}
                        >
                            Kept Up
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        //   lg={4}
                        md={1.5}
                        sm={3}
                        xs={4}
                        mb={2}
                    >
                        <Box
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                        >
                            {/* <MuiLink
                                          href={app.url}
                                          target='_blank'
                                          sx={{
                                              fontWeight: 500,
                                              textDecoration: 'none',
                                              color: '#5f6368',
                                          }}
                                      > */}
                            <Images
                                src={'swiprr.jpg'}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '30px',
                                }}
                            />
                            {/* </MuiLink> */}
                        </Box>

                        <Typography
                            color='text.secondary'
                            variant='body2'
                            sx={{
                                textAlign: 'center',
                                textTransform: 'capitalize',
                                fontSize: '13px',
                                overflowX: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontWeight: 500,
                                mt: 1.5,
                            }}
                        >
                            Swiprr
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default LifeIcon;
