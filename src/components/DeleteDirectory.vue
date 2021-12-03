<template>
    <Loading/>
    <q-dialog v-model="confirm" @hide="$emit('modalCancel')" @escape-key="$emit('modalCancel')">
        <q-card class="deleteCard column justify-evenly bg-grey-3">
            <q-card-section>
                <div class="text-h6 deleteDirectory">Delete Directory</div>
            </q-card-section>
            <q-card-section class="row items-center deleteTextBack">
                <span class="q-ml-sm deleteText">Are you sure you want to delete <strong>{{dirValue.title}}</strong> directory</span>
            </q-card-section>

            <q-card-actions class="row justify-evenly">
                <q-btn flat label="Cancel" class="bg-white  cancel" text-color="black" v-close-popup/>
                <q-btn flat label="Delete" class="bg-dark  delete" color="white" v-close-popup
                       @click="deleteFolder(dirValue)"/>
            </q-card-actions>
        </q-card>
    </q-dialog>

</template>

<script>
    import {apiSerivces} from "../utils";

    export default {
        name: "createDirectory",
        props: ["dirValue"],
        emits: ["deleteFolder", 'modalCancel'],
        data() {
            return {
                confirm: true,
                directoryName: null,
                newToken: false,
            };
        },
        computed: {
            //Getting the object of user (root)
            rootInfo() {
                return this.$store.getters["fileManagement/userInfo"];
            },
        },
        methods: {
            async deleteFolder(val) {
                await this.thisFolder(val);
                if (this.newToken === true) {
                    await this.newRefreshToken();
                    await this.thisFolder(val);
                }
                this.$emit("deleteFolder");
                this.$emit('modalCancel');
            },
            async thisFolder(val) {
                this.$store.commit("general/Set_IsLoading", true);
                const path = `directory/${val.id}`;
                const header = this.rootInfo.access_token;
                const data = {title: val.title};
                await apiSerivces
                    .baseUrl(this.$baseUrl)
                    .path(path)
                    .method("DELETE")
                    .header(header)
                    .data(data)
                    .request(
                        (response) => {
                            this.$store.commit("general/Set_IsLoading", false);
                            this.newToken = false;
                            return response;
                        },
                        (error) => {
                            this.$store.commit("general/Set_IsLoading", false);
                            if (error.response.status === 401) {
                                this.newToken = true;
                            } else if (error.response.status === 400) {
                                this.$q.notify({
                                    color: "red",
                                    textColor: "white",
                                    icon: "cloud_done",
                                    message: "Please try later.",
                                });
                            }
                        }
                    );
            }
        },

    };
</script>

<style scoped>
    .deleteCard {
        min-width: 450px;
        max-width: 450px;
        min-height: 250px;
    }

    @media screen and (max-width: 600px) {
        .deleteCard {
            min-width: 90%;
            max-width: 90%;
        }
    }

    .cancel {
        border: 1px solid black;
        padding-left: 10%;
        padding-right: 10%;
    }

    .delete {
        padding-left: 15%;
        padding-right: 15%;
    }

    .deleteDirectory {
        font-weight: bold;
    }

    .deleteText {
        font-size: 18px;
    }

    .deleteTextBack {
        padding: 5px 30px;
    }
</style>
