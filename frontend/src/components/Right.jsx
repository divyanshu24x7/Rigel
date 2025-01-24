import React,{useState} from 'react'
import profilepic from '../assets/profile-pic.png';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
const Right = () => {

    const [activeMenu,setActiveMenu] = useState('Primary')
    const handleMenuClick = (menu)=>{
        setActiveMenu(menu)
    }
    return (
        <div className="right">
            <div className="messages">
                <div className="heading">
                    <h4>Messages</h4>
                    <CreateIcon />
                </div>
                <div className="search-bar">
                    <SearchIcon />
                    <input type="search" placeholder="Search messages" id="message-search" />
                </div>

                <div className="category">
                    <h6 className={`cursor-pointer ${activeMenu==='Primary'?'active':''}`}
                    onClick={()=>handleMenuClick('Primary')}
                    >
                        Primary</h6>
                    <h6 className={`cursor-pointer ${activeMenu==='General'?'active':''}`}
                    onClick={()=>handleMenuClick('General')}
                    >
                        General</h6>
                    <h6 className={`cursor-pointer ${activeMenu==='Requests'?'active':''}`}
                    onClick={()=>handleMenuClick('Requests')}
                    >
                        Requests (7)</h6>
                </div>
                <div className="message">
                    <div className="profile-photo">
                        <img src={profilepic} />
                    </div>
                    <div className="message-body">
                        <h5>Cat1</h5>
                        <p className="text-muted">Just woke up bruh</p>
                    </div>
                </div>
                <div className="message">
                    <div className="profile-photo">
                        <img src={profilepic} />
                    </div>
                    <div className="message-body">
                        <h5>Cat2</h5>
                        <p className="text-bold">2 new messages</p>
                    </div>
                </div>
                <div className="message">
                    <div className="profile-photo">
                        <img src={profilepic} />
                        <div className="active"></div>
                    </div>
                    <div className="message-body">
                        <h5>Cat3</h5>
                        <p className="text-muted">lol u right</p>
                    </div>
                </div>
                <div className="message">
                    <div className="profile-photo">
                        <img src={profilepic} />
                    </div>
                    <div className="message-body">
                        <h5>Cat4</h5>
                        <p className="text-muted">Birtday Tomorrow</p>
                    </div>
                </div>
                <div className="message">
                    <div className="profile-photo">
                        <img src={profilepic} />
                        <div className="active"></div>
                    </div>
                    <div className="message-body">
                        <h5>Cat5</h5>
                        <p className="text-bold">5 new messages</p>
                    </div>
                </div>

                <div className="message">
                    <div className="profile-photo">
                        <img src={profilepic} />
                    </div>
                    <div className="message-body">
                        <h5>Cat6</h5>
                        <p className="text-muted">haha got that!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Right