export const get_cfb_rankings_request = (user, accessToken) => {
    return {
        url: "http://127.0.1:8000/api/get_cfb_rankings",
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify({
                uid: user.uid,
                accessToken: accessToken,
            })
        }
    };
}