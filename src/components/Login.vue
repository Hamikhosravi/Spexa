<template>
    <div class="loginPage row q-mx-auto ">
        <Loading/>
        <div class="login row items-center">
            <q-card class="my-card">
                <q-card-section>
                    <div class="q-pa-md">
                        <h6 class="text-center loginFormLabel">Try the product out for free</h6>
                        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                            <q-input
                                    class="username"
                                    filled
                                    v-model="username"
                                    label="email"
                                    lazy-rules
                                    :rules="[
                  (val) => !!val || 'please fill this field properly.',
                  (val) =>
                    validations.email(val) || 'email is not correct.',
                ]"
                            />
                            <q-input
                                    class="password"
                                    filled
                                    v-model="password"
                                    label="password"
                                    :type="isPwd ? 'password' : 'text'"
                                    lazy-rules
                                    :rules="[
                                        (val) => !!val || 'please fill this field properly.',
                (val) =>
                  validations.testPassword(val) ||
                  'Password must have at least one capital and one small letter.',
              ]"
                            >
                                <template v-slot:append>
                                    <q-icon
                                            :name="isPwd ? 'visibility_off' : 'visibility'"
                                            class="cursor-pointer"
                                            @click="isPwd = !isPwd"
                                    />
                                </template>
                            </q-input>
                            <div>
                                <q-btn
                                        label="Register / Login"
                                        type="submit"
                                        color="dark"
                                        class="submit q-pa-md"
                                />

                            </div>
                        </q-form>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script>
    import {useQuasar} from "quasar";
    import {ref, inject} from "vue";
    import {useStore} from "vuex";
    import {useRouter} from "vue-router";
    import {apiSerivces, validations} from "../utils/index";

    export default {
        name: "login",
        components: {},
        setup() {
            const $q = useQuasar();
            const router = useRouter();
            const store = useStore();
            const username = ref(null);
            const password = ref(null);
            let notificationMassage = null;
            let notificationColor = null;
            const baseUrl = inject("baseUrl");

            async function onSubmit() {
                store.commit("general/Set_IsLoading", true);
                const data = {
                    email: username.value,
                    password: password.value,
                };
                const path = "user/login";
                await apiSerivces
                    .baseUrl(baseUrl)
                    .path(path)
                    .method("POST")
                    .header()
                    .data(data)
                    .request(
                        (response) => {
                            store.commit("general/Set_IsLoading", false);
                            notificationColor = "green-4";
                            if (response.status === 200) {
                                localStorage.setItem(
                                    "id",
                                    response.data.data.root_directory_id
                                );
                                notificationMassage = "You are logged in properly";
                                store.dispatch("fileManagement/set_Email", username.value);
                                store.dispatch("fileManagement/set_UserInfo", response.data.data);
                                router.push("/fileManagement");
                            }
                        },
                        (error) => {
                            store.commit("general/Set_IsLoading", false);
                            notificationColor = "red-4";
                            if (
                                error.response.status === 400
                            ) {
                                notificationMassage = "Your Email or Password is wrong.";
                                onReset();
                            } else {
                                notificationMassage = "Please try later.";
                            }
                        }
                    );
                $q.notify({
                    color: notificationColor,
                    textColor: "white",
                    icon: "cloud_done",
                    message: notificationMassage,
                });
            }

            function onReset() {
                username.value = null;
                password.value = null;
            }

            return {
                username,
                password,
                validations,
                onSubmit,
                onReset,
                isPwd: ref(true),
            };
        },
    };
</script>

<style scoped>
    .loginFormLabel {
        margin-top: 5px;
    }

    .loginPage {
        height: 100vh;
        width: 500px;
    }

    @media screen and (max-width: 600px) {
        .loginPage {
            width: 80%;
        }
    }

    .login {
        width: 100%;
    }

    .my-card {
        width: 100%;
    }

    .submit {
        width: 100%;
    }
</style>
