export const build_save_user_request = (user) => {
    return {
        url: "http://127.0.1:8000/api/save_user_data",
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email || "none provided",
                displayName: user.displayName || "none provided",
                provider: user.provider
            })
        }
    };
}