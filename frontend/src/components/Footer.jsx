
import React from 'react';
import '../App.css';
import { useAuth } from '../contexts/auth_context.jsx';

const Footer = () => {

    return(
        <footer className="footer">
            <div className="footer-content">
                <p>© 2025 SportSyncSchedule. All rights reserved.</p>
                <p>contact/support: sportsyncschedule@gmail.com</p>
                <div>

                </div>
            </div>
        </footer>
    )
}
export default Footer