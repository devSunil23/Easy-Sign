import { FormControl, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import { styled } from '@mui/material/styles';

const SearchWrapper = styled('div')(({ theme }) => ({
    position: 'relative',
    marginLeft: 0,
    width: '100%',
    maxWidth: '720px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.custom.search.main,
    border: 'none',
    borderRadius: '20px',
}));

const IconWrapperLeft = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
}));

const IconWrapperRight = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(1.5, 1, 1.5),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        },
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        '&:focus': {
            backgroundColor: theme.palette.custom.search.focus,
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 1px 3px',
            borderRadius: '20px',
        },
    },
}));

const SearchBar = () => {
    return (
        <SearchWrapper>
            <IconWrapperLeft>
                <SearchIcon />
            </IconWrapperLeft>
            <FormControl fullWidth>
                <StyledInputBase
                    sx={{
                        flex: 1,
                    }}
                    placeholder='Search...'
                />
            </FormControl>
            <IconWrapperRight>
                <IconButton
                    sx={{
                        background: 'none',
                        display: { xs: 'none', md: 'inline-flex' },
                    }}
                >
                    <TuneIcon />
                </IconButton>
            </IconWrapperRight>
        </SearchWrapper>
    );
};

export default SearchBar;
