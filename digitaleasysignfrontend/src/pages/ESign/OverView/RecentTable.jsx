import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, Typography } from '@mui/material';

const columns = [
    { id: 'S_NO', label: 'S.NO.', minWidth: 30 },
    {
        id: 'Name',
        label: 'NAME',
        minWidth: 400,
    },
    {
        id: 'SHARING',
        label: 'SHARING',
        minWidth: 80,
    },
    {
        id: 'OPENED',
        label: 'OPENED',
        minWidth: 80,
    },
    {
        id: 'SIZE',
        label: 'SIZE',
        minWidth: 80,
    },
];
const RecentTable = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value, 10);
        setPage(0);
    };

    return (
        <>
            <TableContainer>
                <Table stickyHeader aria-label='sticky table'>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            // key={id}
                            sx={{
                                '&:last-child td, &:last-child th': {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component='th' scope='row'>
                                1
                            </TableCell>
                            <TableCell component='th' scope='row'>
                                <Box display='flex' alignItems='center'>
                                    <img
                                        src='https://5.imimg.com/data5/SELLER/Default/2022/11/IJ/KU/IE/7579220/project-paper-sheets.jpg'
                                        alt=''
                                        style={{
                                            height: '50px',
                                            width: '30px',
                                        }}
                                    />
                                    <Typography sx={{ ml: 2 }}>
                                        Employee-Contact-Agreement
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell component='th' scope='row'>
                                Only you
                            </TableCell>
                            <TableCell component='th' scope='row'>
                                Today, 2.23 AM
                            </TableCell>
                            <TableCell component='th' scope='row'>
                                160 KB
                            </TableCell>
                        </TableRow>
                        <TableRow
                            // key={id}
                            sx={{
                                '&:last-child td, &:last-child th': {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component='th' scope='row'>
                                1
                            </TableCell>
                            <TableCell component='th' scope='row'>
                                <Box display='flex' alignItems='center'>
                                    <img
                                        src='https://5.imimg.com/data5/SELLER/Default/2022/11/IJ/KU/IE/7579220/project-paper-sheets.jpg'
                                        alt=''
                                        style={{
                                            height: '50px',
                                            width: '30px',
                                        }}
                                    />
                                    <Typography sx={{ ml: 2 }}>
                                        Employee-Contact-Agreement
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell component='th' scope='row'>
                                Only you
                            </TableCell>
                            <TableCell component='th' scope='row'>
                                Today, 2.23 AM
                            </TableCell>
                            <TableCell component='th' scope='row'>
                                160 KB
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20, 30]}
                component='div'
                // count={departments ? departments?.length : '0'}
                count={10}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default RecentTable;
