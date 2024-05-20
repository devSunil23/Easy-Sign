import {
    Link as MuiLink,
    Grid,
    Typography,
    Box,
    Skeleton,
} from '@mui/material';
import React from 'react';
import { Image } from './Image';

const AppsMenu = ({ sidebarApps }) => {
    return (
        <>
            <Box mt={1}>
                <Grid container alignItems='center' spacing={2} rowSpacing={5}>
                    {sidebarApps
                        ? sidebarApps.map((app) => (
                              <Grid
                                  item
                                  //   lg={4}
                                  md={1.5}
                                  sm={3}
                                  xs={4}
                                  key={app.name}
                                  mb={2}
                              >
                                  <Box
                                      display='flex'
                                      alignItems='center'
                                      justifyContent='center'
                                  >
                                      <MuiLink
                                          href={app.url}
                                          target='_blank'
                                          sx={{
                                              fontWeight: 500,
                                              textDecoration: 'none',
                                              color: '#5f6368',
                                          }}
                                      >
                                          <Image
                                              src={app.logo}
                                              sx={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  height: '30px',
                                              }}
                                          />
                                      </MuiLink>
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
                                      {app.slug}
                                  </Typography>
                              </Grid>
                          ))
                        : Array(9)
                              .fill(0)
                              .map((_, i) => (
                                  <Grid
                                      item
                                      lg={4}
                                      xl={3}
                                      xs={12}
                                      key={i}
                                      align='center'
                                  >
                                      <Skeleton
                                          animation='wave'
                                          width={589}
                                          height={180}
                                          sx={{ mt: 1 }}
                                      />
                                  </Grid>
                              ))}
                </Grid>
            </Box>
        </>
    );
};

export default AppsMenu;
