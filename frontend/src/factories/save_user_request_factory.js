export const build_save_user_request = (user) => {
    let prov_email = "", prov_phone = "", prov_name = "", prov_disp = ""
    if(user["providerData"]){
        if(user["providerData"].length > 0){
            var prov_d = user["providerData"][0]
            if(prov_d.email)
                prov_email = prov_d.email
            if(prov_d.phoneNumber)
                prov_phone = prov_d.phoneNumber
            if(prov_d.displayName)
                prov_disp = prov_d.displayName
            if(prov_d.providerId)
                prov_name = prov_d.providerId
        }
    }
    return {
        url: "http://127.0.1:8000/api/save_user_data",
        options: {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.accessToken
            },
            body: JSON.stringify({
                uid: user.uid,
                provider_email: prov_email,
                provider_phone: prov_phone,
                provider_display_name: prov_disp,
                provider: prov_name,
                accessToken: user.accessToken
            })
        }
    };
}