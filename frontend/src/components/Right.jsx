import React from 'react'
import profilepic from '../assets/profile-pic.png';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
const Right = () => {
    return (
        <div class="right">
            <div class="messages">
                <div class="heading">
                    <h4>Messages</h4>
                    <CreateIcon />
                </div>
                <div class="search-bar">
                    <SearchIcon />
                    <input type="search" placeholder="Search messages" id="message-search" />
                </div>

                <div class="category">
                    <h6 class="active">Primary</h6>
                    <h6>General</h6>
                    <h6 class="message-requests">Requests (7)</h6>
                </div>
                <div class="message">
                    <div class="profile-photo">
                        <img src={profilepic} />
                    </div>
                    <div class="message-body">
                        <h5>Cat1</h5>
                        <p class="text-muted">Just woke up bruh</p>
                    </div>
                </div>
                <div class="message">
                    <div class="profile-photo">
                        <img src={profilepic} />
                    </div>
                    <div class="message-body">
                        <h5>Cat2</h5>
                        <p class="text-bold">2 new messages</p>
                    </div>
                </div>
                <div class="message">
                    <div class="profile-photo">
                        <img src={profilepic} />
                        <div class="active"></div>
                    </div>
                    <div class="message-body">
                        <h5>Cat3</h5>
                        <p class="text-muted">lol u right</p>
                    </div>
                </div>
                <div class="message">
                    <div class="profile-photo">
                        <img src={profilepic} />
                    </div>
                    <div class="message-body">
                        <h5>Cat4</h5>
                        <p class="text-muted">Birtday Tomorrow</p>
                    </div>
                </div>
                <div class="message">
                    <div class="profile-photo">
                        <img src={profilepic} />
                        <div class="active"></div>
                    </div>
                    <div class="message-body">
                        <h5>Cat5</h5>
                        <p class="text-bold">5 new messages</p>
                    </div>
                </div>

                <div class="message">
                    <div class="profile-photo">
                        <img src={profilepic} />
                    </div>
                    <div class="message-body">
                        <h5>Cat6</h5>
                        <p class="text-muted">haha got that!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Right