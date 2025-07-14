export const build_get_user_schedule_daterange_request = (user, accessToken, start, end) => {
    return {
        url: "http://127.0.1:8000/api/get_user_schedule_range",
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify({
                uid: user.uid,
                accessToken: accessToken,
                start: start,
                end: end
            })
        }
    };
}