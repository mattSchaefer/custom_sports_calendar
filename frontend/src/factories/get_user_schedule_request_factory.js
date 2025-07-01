export const build_get_user_schedule_request = (user, accessToken) => {
    return {
        url: "http://127.0.1:8000/api/refresh_schedule",
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify({
                uid: user.uid,
                accessToken: accessToken
            })
        }
    };
}