export const build_get_leagues_or_teams_request = (user, which, accessToken) => {
    var body = {}
    if(which == "leagues"){
        body = {
                uid: "",
                accessToken: "",
                which: which, // 'leagues' or 'teams'
            }
    }else{
        body = {
                uid: user.uid,
                accessToken: accessToken,
                which: which, // 'leagues' or 'teams'
            }
    }
    return {
        url: "http://127.0.1:8000/api/get_leagues_or_teams",
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(body)
        }
    };
}