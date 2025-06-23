export const build_get_leagues_or_teams_request = (user, which, accessToken) => {
    return {
        url: "http://127.0.1:8000/api/get_leagues_or_teams",
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify({
                uid: user.uid,
                accessToken: accessToken,
                which: which, // 'leagues' or 'teams'
            })
        }
    };
}