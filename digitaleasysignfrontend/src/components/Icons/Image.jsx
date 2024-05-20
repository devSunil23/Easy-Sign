import Box from '@mui/material/Box';
import React from 'react';
import { dirname, env } from '../../utilities/function';
import { basename } from '../../utilities/function';

const Image = (props) => {
    const { name, src, sx, ...rest } = props;
    return (
        <Box
            component='img'
            src={src}
            alt='image'
            sx={{ maxWidth: '100%', ...sx }}
            {...rest}
        />
    );
};

const FetchImage = (props) => {
    const { name, sx, ...rest } = props;

    return (
        <Box
            component='img'
            src={`${env('SERVER')}/download/${name}`}
            sx={{ maxWidth: '100%', ...sx }}
            {...rest}
        />
    );
};

const Images = (props) => {
    const { src, ...rest } = props;

    const link =
        src &&
        process.env.PUBLIC_URL +
            '/images/' +
            dirname(src) +
            '/' +
            encodeURIComponent(basename(src));

    return <BaseImage src={link} {...rest} />;
};

function CdnImage(props) {
    const { src, ...rest } = props;

    const link = src && process.env.REACT_APP_CDN_SERVER + '/images/' + src;

    return (
        <Box
            component='img'
            src={link}
            alt='image'
            sx={{ maxWidth: '100%' }}
            {...rest}
        />
    );
}

function BaseImage(props) {
    const { center, ...rest } = props;

    const image = props.src && <img alt='Site' fluid {...rest} />;

    return center ? <div style={{ textAlign: 'center' }}>{image}</div> : image;
}

export { Image, FetchImage, CdnImage, Images };
