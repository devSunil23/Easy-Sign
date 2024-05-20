import { createTheme } from '@mui/material';
import React, { useMemo, useContext, useState, createContext, useLayoutEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { getCookie, setCookie } from '../utilities/cookies';

const ThemeContext = createContext({ toggleTheme: () => {} });

const ThemeContextProvider = props => {
    const preferTheme = systemPreferTheme();
    const [mode, setMode] = useState(preferTheme || 'dark');

    function toggleTheme() {
        setMode(prevMode => {
            const theme = prevMode === 'light' ? 'dark' : 'light';
            setCookie('P13N', theme);
            return theme;
        });
    }

    function systemPreferTheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        else if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
        else return 'dark';
    }

    useLayoutEffect(() => {
        console.log('useLayout');
        const theme = getCookie('P13N');
        if (theme) setMode(theme || preferTheme);
    }, [mode, preferTheme]);

    const light = useMemo(
        () => ({
            background: {
                main: '#FFFFFF',
                paper: '#FFFFFF',
                default: '#F7F9FC',
                box: '#F7F9FC',
            },
            divider: '#e7e3e3',
            custom: {
                search: {
                    main: '#edf2fc',
                    focus: 'white',
                },
                border: '#e7e3e3',
                common: 'white',
                paper: '#F7F9FC',
                menu: '#FFFFFF',
            },
        }),
        []
    );

    const dark = useMemo(
        () => ({
            background: {
                main: '#000000',
                paper: '#141414',
                default: '#141414',
                box: '#000000',
            },
            text: {
                secondary: '#818991',
            },
            divider: '#424242',
            custom: {
                search: {
                    main: '#1A1A1A',
                    focus: '#2F2F2F',
                },
                border: '#616161',
                common: 'black',
                paper: '#141414',
                menu: '#000000',
            },
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#3B84D9',
                    },

                    ...(mode === 'light' ? light : dark),
                },
                breakpoints: {
                    keys: ['xs', 'sm', 'md', 'xm', 'lg', 'xl', 'xxl'],
                    values: {
                        xs: 0,
                        sm: 576,
                        md: 768,
                        xm: 1024,
                        lg: 1280,
                        xl: 1516,
                        xxl: 1756,
                    },
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: theme => ({
                            body: {
                                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                                    backgroundColor: 'transparent',
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                                    borderRadius: 8,
                                    backgroundColor: theme.palette.divider,
                                    // backgroundColor: 'red',
                                },
                                '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
                                    {
                                        backgroundColor: '#747775',
                                    },
                                '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
                                    {
                                        backgroundColor: '#747775',
                                    },
                                '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
                                    {
                                        backgroundColor: '#747775',
                                    },
                            },
                        }),
                    },
                    MuiIconButton: {
                        variants: [
                            {
                                props: {
                                    disableRipple: true,
                                    variant: 'navIcon',
                                },
                                style: ({ theme }) => ({
                                    marginRight: theme.spacing(2),
                                    padding: '10px',
                                    borderRadius: '8px',
                                }),
                            },
                        ],
                        styleOverrides: {
                            root: ({ theme }) => ({
                                backgroundColor: theme.palette.background.paper,
                                '&:hover': {
                                    backgroundColor: theme.palette.custom.background,
                                },
                            }),
                        },
                    },
                    MuiDivider: {
                        styleOverrides: {
                            light: {
                                borderColor: '#424242',
                                width: '100%',
                            },
                        },
                    },
                    MuiListItemButton: {
                        variants: [
                            {
                                props: { variant: 'sidebarButton' },
                                style: ({ theme }) => ({
                                    padding: '2px 12px',
                                    cursor: 'pointer',
                                    color: theme.palette.text.secondary,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                    '&.Mui-selected': {
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.main,
                                        },
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: '8px',
                                        '.MuiListItemIcon-root': {
                                            color: 'white',
                                        },
                                        '.MuiListItemText-root': {
                                            color: 'white',
                                        },
                                        '.MuiSvgIcon-root': {
                                            color: 'white',
                                        },
                                    },
                                }),
                            },
                            {
                                props: { variant: 'sidebarDropDown' },
                                style: ({ theme }) => ({
                                    padding: '2px 0px 2px 12px',
                                    cursor: 'pointer',
                                    color: theme.palette.text.secondary,

                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },

                                    '&.Mui-selected': {
                                        backgroundColor: 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                        '.MuiListItemIcon-root': {
                                            color: theme.palette.primary.main,
                                        },
                                        '.MuiListItemText-root': {
                                            color: theme.palette.primary.main,
                                        },
                                        '.MuiSvgIcon-root': {
                                            color: theme.palette.primary.main,
                                        },
                                    },
                                }),
                            },
                        ],
                    },
                    MuiButton: {
                        variants: [
                            {
                                props: { variant: 'contained' },
                                style: ({ theme }) => ({
                                    color: theme.palette.common.white,
                                }),
                            },
                        ],
                        styleOverrides: {
                            root: {
                                textTransform: 'none',
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                marginBottom: '16px',
                            },
                        },
                    },
                    MuiMenu: {
                        styleOverrides: {
                            root: {
                                // '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
                                //     minWidth: '180px',
                                // },
                                '.MuiMenu-list': {
                                    padding: '5px',
                                },
                                '.MuiButtonBase-root.MuiMenuItem-root': {
                                    fontSize: '14px',
                                },
                            },
                        },
                    },
                    MuiSelect: {
                        styleOverrides: {
                            root: {
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            },
                        },
                    },
                    MuiTab: {
                        styleOverrides: {
                            root: {
                                textTransform: 'capitalize',
                            },
                        },
                    },
                },
            }),
        [mode, dark, light]
    );

    return (
        <ThemeContext.Provider value={{ toggleTheme, mode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {props.children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
export default ThemeContextProvider;

const useTheme = () => {
    const toggleTheme = useContext(ThemeContext).toggleTheme;
    const mode = useContext(ThemeContext).mode;
    return { toggleTheme, mode };
};

export { useTheme };
