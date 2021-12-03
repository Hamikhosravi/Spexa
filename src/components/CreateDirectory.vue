<template>
    <Loading/>
    <q-dialog v-model="prompt" @hide="$emit('modalCancel')" @escape-key="$emit('modalCancel')">
        <q-card class="createCard column justify-evenly bg-grey-3">
            <q-card-section>
                <div class="text-h6">Create Directory</div>
            </q-card-section>

            <q-card-section class="q-py-none q-pt-md directoryNameInput" color="black">
                <q-input outlined class="directoryNameInput" label="title" dense v-model.trim="directoryName" autofocus
                         @keyup.enter="addFolder()" :rules="[
                  (val) => !!val || 'Please fulfill this field.'
                ]"/>
            </q-card-section>

            <q-card-actions align="right" class="text-primary row justify-evenly no-wrap">
                <q-btn color="dark" flat label="Cancel" class="cancel" v-close-popup/>
                <q-btn color="white" flat label="Create" class="create bg-dark"
                       @click=" (directoryName.length === 0 ) ? console.log('No name is inputted'): addFolder()"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
    import {apiSerivces} from "../utils";

    export default {
        name: "createDirectory",
        props: ["directoryId",],
        emits: ["addFolder", "modalCancel"],
        data() {
            return {
                prompt: true,
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
            async addFolder() {
                await this.newFolder();
                if (this.newToken === true) {
                    await this.newRefreshToken();
                    await this.newFolder();
                }
                this.$emit("addFolder");
                this.$emit("modalCancel");
            },

            async newFolder() {
                this.$store.commit("general/Set_IsLoading", true);
                let address = this.rootInfo.root_directory_id;
                if (this.directoryId) {
                    address = this.directoryId;
                }
                const path = `directory/${address}`;
                const header = this.rootInfo.access_token;
                const data = {title: this.directoryName};
                await apiSerivces
                    .baseUrl(this.$baseUrl)
                    .path(path)
                    .method("POST")
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
                                    message: "This directory name already exists.",
                                });
                            }
                        }
                    );
            }
        },

    };
</script>

<style scoped>
    .createCard {
        min-width: 450px;
        min-height: 250px;
    }

    @media screen and (max-width: 600px) {
        .createCard {
            min-width: 90%;

        }
    }

    .cancel {
        border: 1px solid black;
        padding-left: 10%;
        padding-right: 10%;
    }

    .create {
        padding-left: 20%;
        padding-right: 20%;
    }

</style>

