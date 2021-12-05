<template>
    <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders mainLayout">
        <Loading/>
        <CreateDirectory v-if="createDirectory" :key="createDirectory" @modalCancel="modalCancel"
                         @addFolder="refreshFolder" :directoryId="directoryId"/>
        <DeleteDirectory v-if="deleteDirectory" :key="deleteDirectory" @modalCancel="modalCancel"
                         @deleteFolder="refreshFolder" :dirValue="dirValue"/>
        <q-header elevated class="mainHeader">
            <q-toolbar class="bg-white text-black">
                <q-btn outline color="dark" label="logout" class="q-px-lg" @click="logout"/>
                <q-toolbar-title class="emailText">{{email}}</q-toolbar-title>
            </q-toolbar>
        </q-header>
        <q-page class="foldersListContainer">
            <div class="q-pa-md q-gutter-sm">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" label="Home" to="/fileManagement" @click="resetAllSubtitle"/>
                    <q-breadcrumbs-el :label="directoryName" :to="'/fileManagement/'+directoryName" v-if="directoryName"
                                      @click="reset2ndSubtitle"/>
                    <q-breadcrumbs-el :label="subDirectoryName"
                                      :to="'/fileManagement/'+directoryName+'/'+subDirectoryName"
                                      v-if="subDirectoryName"/>
                </q-breadcrumbs>
            </div>
            <div>
                <q-page class="column items-center justify-center noFolderContainer"
                        v-if="noFolder">
                    <q-icon name="move_to_inbox" size="300px" class="material-icons-round"/>
                    <h4 class="q-mt-none noFolderMsg">There is nothing to show</h4>
                    <q-btn label="Create directory" class="q-px-xl createBtn" color="dark" size="18px"
                           text-color="white" @click="createDirectory=true"/>
                </q-page>
                <q-page class="row foldersListBox">
                    <q-card v-for="directory in directoryInfo" :key="directory.id" class="q-ma-sm column folders"
                            flat>
                        <q-btn label="..." class="self-end dirMenuLabel" flat size="25px" text-color="dark">
                            <q-menu class="menuList">
                                <q-list class="q-px-none menuBox">
                                    <q-item v-close-popup class=" q-px-xs menuOpenItem ">
                                        <router-link :to="directoryPath(directory)" class="openLink">
                                            <q-icon name="open_in_new" size="16px"/>
                                            <p class="q-my-none">Open</p>
                                        </router-link>
                                    </q-item>
                                    <q-item clickable v-close-popup
                                            class="row items-center justify-evenly q-px-xs menuDeleteItem"
                                            @click="dirInfo(directory)">
                                        <q-icon name="delete" size="16px"/>
                                        <p class="q-my-none">Delete</p>
                                    </q-item>
                                </q-list>
                            </q-menu>
                        </q-btn>
                        <q-icon name="folder" size="150px"
                                class="folderIcon"/>
                        <p class="q-my-none directoryTitle">{{directory.title}}</p>
                    </q-card>
                    <q-btn flat class="plusSign" v-if="!noFolder">
                        <q-icon name="add" size="70px" @click="createDirectory=true"/>
                    </q-btn>
                </q-page>
            </div>
        </q-page>
    </q-layout>
</template>

<script>
    import {apiSerivces} from "../utils";

    export default {
        name: "FileManagement",
        props: ["directoryName", "subDirectoryName", "directoryParentId", "directoryId"],
        data() {
            return {
                noFolder: true,
                createDirectory: false,
                deleteDirectory: false,
                dirValue: {},
                breadCrumbIsClicked: null,
                parentPath: null,
                rootPath: null,
                newToken: false
            };
        },

        computed: {
            email() {
                return this.$store.getters["fileManagement/email"];
            },
            rootInfo() {
                return this.$store.getters["fileManagement/userInfo"];
            },
            //Checking to show the create directory page when no folder exists or not.
            directoryInfo() {
                const statusFolder = this.$store.getters["fileManagement/directoryInfo"];
                if (statusFolder.length !== 0) {
                    this.statusFolder();
                    return statusFolder;
                }
                this.notFolder();
                return false;
            }
        },
        methods: {
            //When the home path of breadcrumb is clicked.
            resetAllSubtitle() {
                this.breadCrumbIsClicked = "root";
            },
            //When the first directory path of breadcrumb is clicked.
            reset2ndSubtitle() {
                this.breadCrumbIsClicked = "sub";
            },
            //Information which should get saved through routing.
            directoryPath(val) {
                if (val.parent === this.$store.getters["fileManagement/userInfo"].root_directory_id) {
                    this.rootPath = val.parent;
                    this.parentPath = val.id;
                    return {
                        name: 'subDirectory',
                        params: {directoryName: val.title, directoryId: val.id, directoryParentId: val.parent}
                    };
                } else {
                    return {
                        name: '2ndSubDirectory',
                        params: {subDirectoryName: val.title, directoryId: val.id, directoryParentId: val.parent}
                    };
                }
            },
            //passing the folder info to the Delete directory and showing the DeleteDirectory too.
            dirInfo(val) {
                this.dirValue = val;
                this.deleteDirectory = true;
            },
            //hover of items get removes.
            removeBtnHover() {
                let hoverElements = document.getElementsByTagName("button");
                for (let i = 0, len = hoverElements.length; i < len; i++) {
                    hoverElements[i].classList.remove("q-hoverable");
                }
            },
            //Refreshing all existing folders when a folder is created or deleted.
            refreshFolder() {
                this.loadFiles();
            },
            //Removing modals when gets cancelled or confirmed.
            modalCancel() {
                this.createDirectory = false;
                this.deleteDirectory = false;
            },
            notFolder() {
                this.noFolder = true;
                if (this.email === null){
                    this.$router.replace("/");
                }
            },
            statusFolder() {
                this.noFolder = false;
            },
            logout() {
                localStorage.removeItem("id");
                this.$router.replace("/");
            },
            //Loading all folders in any path.
            async loadFiles() {
                this.$store.commit("general/Set_IsLoading", true);
                let address = this.rootInfo.root_directory_id;
                if (this.directoryId) {
                    address = this.directoryId;
                }
                if (this.breadCrumbIsClicked === "root") {
                    address = this.rootPath;
                    this.breadCrumbIsClicked = null;
                }
                if (this.breadCrumbIsClicked === "sub") {
                    address = this.parentPath;
                    this.breadCrumbIsClicked = null;
                }
                const path = `directory/${address}`;
                const header = this.rootInfo.access_token;
                await apiSerivces
                    .baseUrl(this.$baseUrl)
                    .path(path)
                    .method("GET")
                    .header(header)
                    .data()
                    .request(
                        (response) => {
                            this.$store.commit("general/Set_IsLoading", false);
                            this.newToken = false;
                            this.$store.dispatch("fileManagement/set_DirectoryInfo", response.data.data.directories);
                        },
                        (error) => {
                            this.$store.commit("general/Set_IsLoading", false);
                            if (error.response.status === 401) {
                                console.log("error: "+error);
                                console.log("error response: "+error.response);
                                console.log("error response message1: "+error.response.message);
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
                this.removeBtnHover();
            }
        },
        //when a user is logged out, cannot get back to the fileManagement path again.
        beforeCreate() {
            if (localStorage.getItem("id") === null) {
                this.$router.replace("/");
            }
        },
        //Loading all folders for the first time.
        beforeMount() {
            this.loadFiles();
        },
        //after first time when this component is called the following method will be run.
        async updated() {
            await this.loadFiles();
            if (this.newToken === true) {
                await this.newRefreshToken();
                this.loadFiles();
            }
        },
    };
</script>

<style scoped>
    .emailText {
        font-size: 16px;
        font-weight: bold;
    }

    .dirMenuLabel {
        display: inline-block;
        line-height: 15px;
        min-height: 30px;
    }

    .openLink {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: black;
        text-decoration: none;
    }

    .mainLayout {
        min-height: 100vh;
    }

    .plusSign {
        width: 150px;
    }

    .mainHeader {
        position: relative;
    }

    .foldersListContainer {
        padding: 20px 110px 0 110px;
    }

    @media screen and (max-width: 600px) {
        .foldersListContainer {
            padding: 20px 20px 0 20px;
        }
    }

    .noFolderContainer {
        height: 90%;
        min-height: 730px !important;
    }

    .createBtn {
        width: 400px;
    }

    @media screen and (max-width: 600px) {
        .createBtn {
            width: 80%;
        }
        .noFolderMsg{
            font-size: 25px;
        }
        .noFolderContainer {
            min-height: 650px !important;
        }
    }

    .foldersListBox {
        min-height: 0 !important;
    }

    .folders {
        width: 150px;
        height: 170px;
        background: none;
    }

    .menuBox {
        width: 90px;
    }

    .menuOpenItem, .menuDeleteItem {
        min-height: unset;
    }
    .menuOpenItem:hover, .menuDeleteItem:hover{
        background-color: lightgray;
    }

    .folderIcon {
        line-height: 100px;
        width: 100%;
        height: 105px;
        overflow: hidden;
    }

    .directoryTitle {
        text-align: center;
        font-size: 18px;
    }
</style>


