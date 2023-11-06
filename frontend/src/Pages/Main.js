import React from 'react';
import Friends from '../Components/Friends';
import Profile from '../Components/Profile';
import CustomCanlendar from '../Components/CustomCalendar';
import GroupAlert from '../Components/GroupAlert';
import '../Style/Main.css';

const Main = () => {
  return (
    <div className='main-container'>
      <div className='background-image'>
        <div className='quadrant'>
          <div className='group-alert-container'>
            <GroupAlert />
          </div>
          <div className='diary-container'>
            <CustomCanlendar />
          </div>
        </div>
        <div className='quadrant'>
          <div className='profile-container'>
            <Profile />
          </div>
          <div className='friend-group-container'>
            <Friends />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
