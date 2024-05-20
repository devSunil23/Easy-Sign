import React, { useCallback, useEffect, useState } from "react";

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

//mui component
import {
    AppBar,
    Box,
    Stack,
    Drawer as MuiDrawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Button,
    Grid,
    Toolbar,
    Typography,
    ListItemButton,
    Menu,
    MenuItem,
    Modal,
    useTheme as useMuiTheme,
    Skeleton,
    LinearProgress,
    Collapse,
    styled,
    useMediaQuery,
    Link as MuiLink,
    Tooltip,
} from "@mui/material";

//mui icons
import { fileManager, sharedFile, team } from "../../services/sidebarLinks";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import AppsIcon from "@mui/icons-material/Apps";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ExpandMore from "@mui/icons-material/ExpandMore";

//services
import { useTheme } from "../../style/theme";
import { useMenu } from "../../hooks/useMenu";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import SearchBar from "./SearchBar";
import axios from "axios";
import { useMessage } from "../Header/Header";
import { useUser } from "../../hooks/Authorize";
import useModal from "../../hooks/useModal";
import ActionIcon from "../Icons/ActionIcon";
import { clearCookie } from "../../utilities/cookies";
import {
    env,
    getFullURL,
    handleAxiosError,
    parseKB,
} from "../../utilities/function";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Feedback from "./Feedback";

import DescriptionIcon from "@mui/icons-material/Description";

import SummarizeIcon from "@mui/icons-material/Summarize";
import MicrophoneIcon from "./MicrophoneIcon";
import { CdnImage } from "../Icons/Image";

const drawerWidth = 260;
const appsWidth = 54;
const miniDrawerWidth = 72;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    backgroundColor: theme.palette.background.default,
    borderRight: "none",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.background.default,
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    borderRight: "none",
});

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,

    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

export default function Navbar(props) {
    const { children } = props;
    const { showError, showSuccess } = useMessage();
    const location = useLocation();

    const { toggleTheme, mode } = useTheme();
    const theme = useMuiTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarApps, setSidebarApps] = useState(null);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [editable, setEditable] = useState(false);

    const [collapseDrawer, setCollapseDrawer] = useState(true);
    const [drawerHover, setDrawerHover] = useState(false);
    const matches = useMediaQuery("(min-width:1024px)", { noSsr: true });
    const [stats, setStats] = useState(null);

    const user = useUser();

    const [openDocuments, setOpenDocuments] = useState(true);
    const [openTemplate, setOpenTemplate] = useState(true);

    const handleClickDocumnets = () => {
        setOpenDocuments(!openDocuments);
    };
    const handleClicktemplate = () => {
        setOpenTemplate(!openTemplate);
    };
    useEffect(() => {
        fileManager.find((link) => link.to === location.pathname) &&
            setOpenDocuments(true);
    }, [location.pathname]);
    useEffect(() => {
        sharedFile.find((link) => link.to === location.pathname) &&
            setOpenTemplate(true);
    }, [location.pathname]);

    const {
        modalState: feedbackState,
        openModal: openFeedback,
        closeModal: closeFeedback,
    } = useModal();

    // useMenu
    const {
        anchorEl: anchorElProfile,
        openMenu: openProfileMenu,
        closeMenu: closeProfileMenu,
    } = useMenu();

    const {
        anchorEl: anchorElSettings,
        openMenu: openSettingsMenu,
        closeMenu: closeSettingsMenu,
    } = useMenu();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDrawerOpen = () => {
        setCollapseDrawer(!collapseDrawer);
    };
    /**This is redriect to app.clikkle.com */
    const handleClickOpenMenu = () => {
        window.location.href = "https://apps.clikkle.com";
    };
    /**This is navigate documents route */
    const navigate = useNavigate();
    const allDocumentsNavigateHandller = () => {
        navigate("/documents");
    };
    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )
            return;

        setIsOrderChanged(true);

        const draggingJob = sidebarApps[source.index];
        sidebarApps.splice(source.index, 1);

        sidebarApps.splice(destination.index, 0, draggingJob);
        setSidebarApps([...sidebarApps]);
    };

    const getPlatforms = useCallback(async () => {
        try {
            const response = await axios.get(
                "/platforms?sortBy=name&direction=1",
                {
                    baseURL: env("AUTHENTICATION_SERVER"),
                }
            );

            const { success, errors, platforms } = response.data;

            if (!success) return showError(errors);

            const SidebarApps = platforms?.filter(
                (platform) => platform.slug !== "e-sign"
            ); // Platform to exclude from list

            SidebarApps.forEach((app, i) => (app.order = i + 1));

            const arrangedOrder = [];
            user?.personalize?.appsOrder.forEach((order) => {
                SidebarApps.forEach((app, i) => {
                    if (order === app.order) {
                        arrangedOrder.push(app);
                        SidebarApps.splice(i, 1);
                    }
                });
            });

            if (arrangedOrder.length)
                setSidebarApps([...arrangedOrder, ...SidebarApps]);
            else setSidebarApps(SidebarApps);
        } catch (e) {
            console.log(e);
        }
    }, [user, showError]);

    const saveOrder = async () => {
        const appsOrder = sidebarApps.map((app) => app.order);

        try {
            const response = await axios.patch(
                "/user/personalize",
                { appsOrder },
                {
                    baseURL: env("AUTHENTICATION_SERVER"),
                }
            );

            const { success, errors } = response.data;

            if (!success) return showError(errors);

            showSuccess("Setting updated");
        } catch (e) {
            handleAxiosError(e, showError);
        } finally {
            setIsOrderChanged(false);
        }
    };

    const signOut = () => {
        clearCookie("accessToken");
        clearCookie("role");
        clearCookie("userId");
        clearCookie("setupCompleted");
        const redirectTo = `${env(
            "AUTHENTICATION_CLIENT"
        )}/login?redirectto=${encodeURIComponent(getFullURL(location))}`;
        window.location.replace(redirectTo);
    };

    const getStorage = useCallback(async () => {
        try {
            const response = await axios.get(`/open/stats/${user._id}`, {
                baseURL: env("FILES_SERVER"),
                withCredentials: false,
            });

            const { success, errors, stats } = response.data;
            if (!success) return showError(errors);

            setStats(stats);
        } catch (e) {
            console.log(e);
        }
    }, [setStats, user, showError]);

    useEffect(() => {
        user && getStorage();
    }, [user, getStorage]);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname, location.hash]);

    useEffect(() => {
        user && getPlatforms();
    }, [user, getPlatforms]);

    const drawer = (
        <Box
            minHeight="100dvh"
            color="text.secondary"
            display="flex"
            flexDirection="column">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                sx={{ textDecoration: "none", color: "text.primary", py: 1 }}>
                <img
                    src="https://cdn.clikkle.com/images/e-sign/logo/2023/e-sign-text.png"
                    style={{
                        objectFit: "contain",
                        height: "50px",
                        maxWidth: "100%",
                    }}
                    component="img"
                    alt="logo"
                />
            </Box>

            <Box
                sx={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    height: "calc(100vh - 90px)",
                }}>
                <Typography
                    variant="body2"
                    pl={3}
                    pb={1}
                    mt={1.5}
                    fontSize="14px"
                    fontWeight={500}>
                    E-sign
                </Typography>
                <List sx={{ px: 3, py: 0 }}>
                    {team.map((link) => (
                        <NavLink
                            to={link.to}
                            key={link.name}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}>
                            {({ isActive }) => (
                                <ListItem disablePadding>
                                    <Tooltip
                                        title={`${link.name} page`}
                                        arrow
                                        placement="right">
                                        <ListItemButton
                                            selected={isActive}
                                            disableRipple
                                            disableTouchRipple
                                            variant="sidebarButton">
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: "30px",
                                                    color: "text.secondary",
                                                }}>
                                                {link.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={link.name} />
                                        </ListItemButton>
                                    </Tooltip>
                                </ListItem>
                            )}
                        </NavLink>
                    ))}
                </List>
                <Divider variant="middle" sx={{ my: 1 }} />
                <Typography
                    variant="body2"
                    pl={3}
                    pb={1}
                    mt={1.5}
                    fontSize="14px"
                    fontWeight={500}>
                    Documents
                </Typography>
                <List sx={{ px: 3, mt: 0, py: 0 }}>
                    <ListItemButton
                        onClick={handleClickDocumnets}
                        disableRipple
                        disableTouchRipple
                        variant="sidebarButton"
                        selected={openDocuments}>
                        <ListItemIcon
                            sx={{
                                minWidth: "35px",
                                color: "text.secondary",
                            }}>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Documents"
                            onClick={allDocumentsNavigateHandller}
                        />
                        {openDocuments ? (
                            <ExpandMore fontSize="small" />
                        ) : (
                            <ChevronRightOutlinedIcon />
                        )}
                    </ListItemButton>
                    <Collapse in={openDocuments} timeout="auto" unmountOnExit>
                        <List sx={{ p: "10px", py: 0 }}>
                            {fileManager.map((link) => (
                                <NavLink
                                    to={link.to}
                                    key={link.name}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}>
                                    {({ isActive }) => (
                                        <ListItem disablePadding>
                                            <Tooltip
                                                title={`${link.name} Documents`}
                                                arrow
                                                placement="right">
                                                <ListItemButton
                                                    selected={isActive}
                                                    disableRipple
                                                    disableTouchRipple
                                                    variant="sidebarDropDown">
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: "30px",
                                                            color: "text.secondary",
                                                        }}>
                                                        {link.icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        secondary={
                                                            <Typography variant="caption">
                                                                {link.name}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </Tooltip>
                                        </ListItem>
                                    )}
                                </NavLink>
                            ))}
                        </List>
                    </Collapse>
                </List>
                <Divider variant="middle" sx={{ my: 1 }} />
                <Typography
                    variant="body2"
                    pl={3}
                    pb={1}
                    mt={1.5}
                    fontSize="14px"
                    fontWeight={500}>
                    Templates
                </Typography>
                <List sx={{ px: 3, mt: 0, py: 0 }}>
                    <ListItemButton
                        onClick={handleClicktemplate}
                        disableRipple
                        disableTouchRipple
                        variant="sidebarButton"
                        selected={openTemplate}>
                        <ListItemIcon
                            sx={{
                                minWidth: "35px",
                                color: "text.secondary",
                            }}>
                            <SummarizeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Templates" />
                        {openTemplate ? (
                            <ExpandMore fontSize="small" />
                        ) : (
                            <ChevronRightOutlinedIcon />
                        )}
                    </ListItemButton>
                    <Collapse in={openTemplate} timeout="auto" unmountOnExit>
                        <List sx={{ p: "10px", py: 0 }}>
                            {sharedFile.map((link) => (
                                <NavLink
                                    to={link.to}
                                    key={link.name}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}>
                                    {({ isActive }) => (
                                        <ListItem disablePadding>
                                            <Tooltip
                                                title={`${link.name}`}
                                                arrow
                                                placement="right">
                                                <ListItemButton
                                                    selected={isActive}
                                                    disableRipple
                                                    disableTouchRipple
                                                    variant="sidebarDropDown">
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: "30px",
                                                            color: "text.secondary",
                                                        }}>
                                                        {link.icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        secondary={
                                                            <Typography variant="caption">
                                                                {link.name}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </Tooltip>
                                        </ListItem>
                                    )}
                                </NavLink>
                            ))}
                        </List>
                    </Collapse>
                </List>
            </Box>
            <Divider variant="middle" />
            <Box pb={0}>
                <Divider variant="middle" />
                {stats ? (
                    <>
                        <Typography
                            variant="body2"
                            pl={3}
                            mt={1.5}
                            fontSize="14px"
                            fontWeight={500}>
                            Storage
                        </Typography>

                        <Box px={3} pb={3}>
                            <LinearProgress
                                variant="determinate"
                                value={(stats.used / stats.storage) * 100}
                                color="primary"
                                sx={{ borderRadius: "2px", mt: 1 }}
                            />
                            <Typography
                                variant="caption"
                                component="div"
                                mt={1}
                                color="primary.main">
                                {parseKB(stats.used)} used of{" "}
                                {parseKB(stats.storage)}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={
                                    <CloudOutlinedIcon fontSize="small" />
                                }
                                sx={{ mt: 1, color: "white" }}
                                href={env("MY_ACCOUNT")}
                                fullWidth>
                                Upgrade storage
                            </Button>
                        </Box>
                    </>
                ) : null}
                <Divider
                    variant="middle"
                    sx={{ display: { xs: "block", sm: "none" } }}
                />
                <List sx={{ px: 1, display: { xs: "block", sm: "none" } }}>
                    <ListItem
                        disablePadding
                        onClick={openSettingsMenu}
                        sx={{
                            "&:hover": {
                                backgroundColor: "custom.cardHover",
                                borderRadius: "8px",
                            },
                        }}>
                        <ListItemButton
                            disableRipple
                            disableTouchRipple
                            variant="sidebarButton">
                            <ListItemIcon
                                sx={{
                                    minWidth: "30px",
                                    color: "text.secondary",
                                }}>
                                <SettingsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Settings"
                                primaryTypographyProps={{ fontSize: 14 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Stack
                    direction="row"
                    justifyContent="center"
                    my={1}
                    sx={{ display: { xs: "none", sm: "flex" } }}>
                    <MuiLink
                        display="inline-flex"
                        alignItems="center"
                        color="text.secondary"
                        sx={{ cursor: "pointer" }}
                        onClick={openFeedback}>
                        <MicrophoneIcon />
                        <Typography variant="caption" fontWeight="bold">
                            Give feedback
                        </Typography>
                    </MuiLink>
                </Stack>
            </Box>
        </Box>
    );

    const miniDrawer = (
        <Box
            minHeight="100dvh"
            color="text.secondary"
            display="flex"
            flexDirection="column">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                component={Link}
                mb={3}
                to="/"
                sx={{ textDecoration: "none", color: "text.primary", py: 1 }}>
                <CdnImage
                    src="e-sign/logo/2023/e-sign.png"
                    sx={{ height: "50px" }}
                />
            </Box>
            <Box
                sx={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    height: "calc(100dvh - 90px)",
                    flexGrow: 1,
                }}>
                <List sx={{ px: 1, pb: 0 }}>
                    {team.map((link) => (
                        <NavLink
                            to={link.to}
                            key={link.name}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}>
                            {({ isActive }) => (
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={isActive}
                                        disableRipple
                                        disableTouchRipple
                                        variant="sidebarButton"
                                        sx={{ height: "45px", my: "2px" }}>
                                        <ListItemIcon
                                            sx={{
                                                minWidth: "30px",
                                                color: "text.secondary",
                                            }}>
                                            {link.icon}
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </NavLink>
                    ))}
                </List>

                <List sx={{ px: 1, py: 0, my: "2px" }}>
                    <ListItemButton
                        onClick={handleClickDocumnets}
                        disableRipple
                        disableTouchRipple
                        variant="sidebarButton"
                        selected={openDocuments}
                        sx={{ height: "45px" }}>
                        <ListItemIcon
                            sx={{
                                minWidth: "35px",
                                color: "text.secondary",
                            }}>
                            <DescriptionIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </List>

                <List sx={{ px: 1, pt: 0, my: "2px" }}>
                    <ListItemButton
                        onClick={handleClicktemplate}
                        disableRipple
                        disableTouchRipple
                        variant="sidebarButton"
                        selected={openTemplate}
                        sx={{ height: "45px" }}>
                        <ListItemIcon
                            sx={{
                                minWidth: "35px",
                                color: "text.secondary",
                            }}>
                            <SummarizeIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </List>
            </Box>
        </Box>
    );

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                px: { xs: 0.5, xm: 0 },
                height: "100dvh",
                position: "relative",
            }}>
            <AppBar
                elevation={0}
                component={Box}
                position="sticky"
                sx={{
                    width: {
                        xs: "100%",
                        xm:
                            collapseDrawer && !drawerHover
                                ? `calc(100% - ${drawerWidth}px)`
                                : `calc(100% - ${miniDrawerWidth}px )`,
                    },
                    ml: {
                        xm:
                            collapseDrawer && !drawerHover
                                ? `${drawerWidth}px`
                                : `${miniDrawerWidth}px`,
                    },
                    transition: "225ms, background-color 0s",

                    backgroundColor: "background.default",
                    borderBottom: "1px solid custom.border",
                    color: "text.primary",
                }}>
                <Toolbar
                    sx={{
                        flexDirection: "column",
                        justifyContent: "center",
                        position: "relative",
                        "&": {
                            minHeight: "64px",
                            px: 1,
                        },
                    }}>
                    <Grid container alignItems="center" columnSpacing={1}>
                        <Grid item>
                            <IconButton
                                onClick={
                                    matches
                                        ? handleDrawerOpen
                                        : handleDrawerToggle
                                }
                                edge="start"
                                sx={{
                                    ml: 0.2,
                                    mr: 1,
                                }}>
                                <MenuIcon sx={{ fontSize: "30px" }} />
                            </IconButton>
                        </Grid>

                        <Grid item xs md={5} alignItems="start">
                            <SearchBar />
                        </Grid>
                        <Grid item xs display={{ xs: "none", sm: "block" }}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-end"
                                spacing={0}>
                                <IconButton onClick={openSettingsMenu}>
                                    <SettingsIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorElSettings}
                                    open={Boolean(anchorElSettings)}
                                    onClose={closeSettingsMenu}>
                                    <MenuItem onClick={toggleTheme}>
                                        <ListItemIcon>
                                            {mode === "dark" ? (
                                                <LightModeIcon fontSize="small" />
                                            ) : (
                                                <DarkModeIcon fontSize="small" />
                                            )}
                                        </ListItemIcon>
                                        Appearance
                                    </MenuItem>
                                </Menu>

                                <IconButton onClick={handleClickOpenMenu}>
                                    <AppsIcon />
                                </IconButton>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <IconButton
                                onClick={openProfileMenu}
                                sx={{
                                    borderWidth: "2px",
                                    borderStyle: "solid",
                                    borderColor: "primary.main",
                                    p: "3px",
                                }}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src="data:image/jpeg;base64,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"
                                    sx={{ width: 30, height: 30 }}
                                />
                            </IconButton>

                            <Menu
                                anchorEl={anchorElProfile}
                                open={Boolean(anchorElProfile)}
                                onClose={closeProfileMenu}
                                sx={{
                                    ".MuiPaper-root.MuiMenu-paper.MuiPopover-paper":
                                        {
                                            width: "min(100%, 320px)",
                                            boxShadow:
                                                "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
                                            border: "1px solid #00000017",
                                            bgcolor: "custom.menu",
                                            px: 0.5,
                                            pt: 1.5,
                                        },
                                }}>
                                <Grid
                                    container
                                    spacing={2}
                                    alignItems="center"
                                    flexWrap="nowrap">
                                    <Grid item>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src="https://shorturl.at/fjqz9"
                                            sx={{ width: 100, height: 100 }}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography
                                            variant="substitle1"
                                            component="div"
                                            fontWeight={600}
                                            sx={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}>
                                            {user.firstName +
                                                " " +
                                                user.lastName}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            component="div"
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}>
                                            {user.email}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            component="a"
                                            href={env("MY_ACCOUNT")}
                                            color="primary.main"
                                            display="block">
                                            My account
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            component="a"
                                            href="#"
                                            color="primary.main"
                                            display="block">
                                            My Profile
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Stack direction="row" mt={2}>
                                    <Button variant="text" fullWidth>
                                        Add account
                                    </Button>
                                    <Button
                                        variant="text"
                                        onClick={signOut}
                                        fullWidth>
                                        Sign out
                                    </Button>
                                </Stack>
                            </Menu>
                        </Grid>
                    </Grid>
                </Toolbar>

                <Box
                    sx={{
                        width: appsWidth,
                        display: { xs: "none", xm: "block" },
                        backgroundColor: "background.default",
                        zIndex: "1200",
                        position: "absolute",
                        right: 0,
                        top: 65,
                    }}>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                        overflow="hidden"
                        px={0.8}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable
                                droppableId="apps"
                                isDropDisabled={!editable}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}>
                                        {sidebarApps ? (
                                            sidebarApps.map((app, i) => (
                                                <Draggable
                                                    key={app.order}
                                                    draggableId={app.name}
                                                    index={i}
                                                    isDragDisabled={!editable}>
                                                    {(provided) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}>
                                                            <ActionIcon
                                                                title={
                                                                    editable
                                                                        ? ""
                                                                        : app.name
                                                                }
                                                                href={app.url}
                                                                src={app.logo}
                                                                key={app.order}
                                                                sx={{
                                                                    mt: 0.8,
                                                                    width: "auto",
                                                                }}
                                                                imageSx={{
                                                                    filter:
                                                                        editable &&
                                                                        `drop-shadow(0px 2px 2px ${theme.palette.primary.main})`,
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        ) : (
                                            <Box mt={2}>
                                                {Array(8)
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <Skeleton
                                                            variant="circular"
                                                            animation="wave"
                                                            key={i}
                                                            width={35}
                                                            height={35}
                                                            sx={{ mb: 2 }}
                                                        />
                                                    ))}
                                            </Box>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <Divider
                            variant="middle"
                            sx={{ my: 2, width: "80%" }}
                        />
                        {editable ? (
                            <ActionIcon
                                title="Save"
                                icon={<DoneIcon fontSize="small" />}
                                onClick={() => {
                                    setEditable(false);
                                    if (isOrderChanged) saveOrder();
                                }}
                            />
                        ) : (
                            <ActionIcon
                                title="Edit"
                                icon={<EditIcon fontSize="small" />}
                                onClick={() => setEditable(true)}
                            />
                        )}
                    </Stack>
                </Box>
            </AppBar>

            <Box
                component="nav"
                sx={{
                    width: { xm: drawerWidth },
                    flexShrink: { sm: 0 },
                    bgcolor: "custom.menu",
                }}>
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <MuiDrawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", xm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            bgcolor: "custom.menu",
                        },
                    }}>
                    {drawer}
                </MuiDrawer>
                <Drawer
                    variant="permanent"
                    open={collapseDrawer}
                    hover={drawerHover}
                    onMouseOver={() => {
                        if (!collapseDrawer) {
                            setCollapseDrawer(true);
                            setDrawerHover(true);
                        }
                    }}
                    onMouseLeave={() => {
                        if (drawerHover) {
                            setCollapseDrawer(false);
                            setDrawerHover(false);
                        }
                    }}
                    sx={{
                        display: { xs: "none", xm: "block" },
                        p: 0,
                        "& .MuiDrawer-paper": {
                            boxShadow: drawerHover
                                ? "rgba(149, 157, 165, 0.2) 0px 8px 24px"
                                : "none",
                        },
                    }}>
                    {collapseDrawer ? drawer : miniDrawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    width: {
                        xs: "100%",
                        xm:
                            collapseDrawer && !drawerHover
                                ? `calc(100% - ${drawerWidth + appsWidth}px)`
                                : `calc(100% - ${
                                      appsWidth + miniDrawerWidth
                                  }px )`,
                    },
                    ml: {
                        xm:
                            collapseDrawer && !drawerHover
                                ? `${drawerWidth}px`
                                : `${miniDrawerWidth}px`,
                    },
                    transition: "225ms, background-color 0s",
                    mt: 1,
                    height: { xs: "calc(100dvh - 90px)" },
                    overflow: "auto",
                    backgroundColor: "background.main",
                    borderRadius: "12px",
                    px: 2,
                }}>
                {children}
            </Box>

            <Modal
                open={feedbackState}
                onClose={closeFeedback}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                }}>
                <>
                    <Feedback closeModal={closeFeedback} />
                </>
            </Modal>
        </Box>
    );
}
