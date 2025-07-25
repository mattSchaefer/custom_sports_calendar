export const build_delete_user_request = (user) => {
    return {
        url: "http://127.0.1:8000/api/delete_user_record",
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.accessToken
            },
            body: JSON.stringify({
                uid: user.uid,
                accessToken: user.accessToken
            })
        }
    };
}