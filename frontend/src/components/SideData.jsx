import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CreateIcon from '@mui/icons-material/Create';
export const SideData = [
    {
        title: 'Home',
        icon:<HomeIcon sx={{fontSize: '2rem'}}/>,
        link:"/home",
    },
    {
        title: 'Messages',
        icon:<EmailOutlinedIcon sx={{fontSize: '2rem'}}/>,
        link:"/messages",
    },
    {
        title: 'Tags',
        icon:<BookmarkBorderOutlinedIcon sx={{fontSize: '2rem'}}/>,
        link:"/tags",
    },
    {
        title: 'Profile',
        icon:<Person2OutlinedIcon sx={{fontSize: '2rem'}}/>,
        link:"/profile",
    },
    {
        title: 'About',
        icon:<InfoOutlinedIcon sx={{fontSize: '2rem'}}/>,
        link:"/about",
    },
    {
        title: 'Post',
        icon:<CreateIcon sx={{fontSize: '3rem'}}/>,
        link:"/post",
    },
]

