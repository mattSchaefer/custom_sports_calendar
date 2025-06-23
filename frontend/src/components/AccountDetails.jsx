import React from 'react'
import { useState, useEffect } from 'react'
import '../App.css'
import { useAuth } from '../contexts/auth_context.jsx'
import { build_save_user_request } from '../factories/save_user_request_factory.js'

const AccountDetails = () => {
    const { user, loading, signOut, accessToken } = useAuth();
    const [accountType, setAccountType] = useState(user?.account_type || 'basic');

    useEffect(() => {
        console.log('User data account details:', user);
    }, [user]);

    const handleUpgrade = () => {
        // Logic to upgrade account type
        console.log('Upgrade account type');
    };

    return (
        <div className="account-details-container">
            <div className="notification-info-container">
                <h4>Account Info</h4>
                <div className="notification-info-attributes">
                    <span>Email: {user?.email}</span>
                    <span>Phone: {user?.phone}</span>
                    <span>Account Type: {accountType}
                        <button onClick={handleUpgrade} className="upgrade-button">Upgrade!</button>
                    </span>
                </div>
            </div>
            {/* <div className="favorites-container">
                <h4>My Leagues & Teams</h4>
                <div className="favorites-list">

                </div>
            </div> */}
        </div>
    );
}
export default AccountDetails