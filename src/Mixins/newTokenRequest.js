import {apiSerivces} from "../utils";

//Updating the tokens of user(root)
export default {
    name: "newTokenRequest",
    methods: {
        async newRefreshToken() {
            this.$store.commit("general/Set_IsLoading", true);
            const path = `user/refresh`;
            const data = {refresh_token: this.rootInfo.refresh_token};
            await apiSerivces
                .baseUrl("https://spexa.tk/")
                .path(path)
                .method("POST")
                .header()
                .data(data)
                .request(
                    (response) => {
                        this.$store.commit("general/Set_IsLoading", false);
                        let result = response.data.data;
                        let userInfo = {
                            ...this.rootInfo, ["access_token"]: result.access_token, ["refresh_token"]:
                            result.refresh_token
                        };
                        this.$store.dispatch("fileManagement/set_UserInfo", userInfo);
                    },
                    (error) => {
                        this.$store.commit("general/Set_IsLoading", false);
                        if (error.response.status === 400) {
                            this.$q.notify({
                                color: "red",
                                textColor: "white",
                                icon: "cloud_done",
                                message: error,
                            });
                        }
                    }
                );
        }
    }
}
