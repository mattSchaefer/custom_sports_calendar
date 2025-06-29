export const build_set_favorite_request = (user, accessToken, which, teams_or_leagues) => {
    const stripped_ids = []
    for(var i = 0; i < teams_or_leagues.length; i++){
        if(teams_or_leagues[i] && teams_or_leagues[i].id)
            stripped_ids.push(teams_or_leagues[i].id.toString())
    }
    return {
        url: "http://127.0.1:8000/api/update_user_team_or_leagues",
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify({
                uid: user.uid,
                accessToken: accessToken,
                which: which, // 'favorite_teams', 'following_teams', or 'following_leagues'
                teams_or_leagues: stripped_ids//teams_or_leagues // array of team or league IDs
            })
        }
    };
}