import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from './components/Login'
import fileManagement from "./components/FileManagement";


const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginPage
    },
    {
        path: "/fileManagement",
        component: fileManagement, props: true
    },
    {
        path: "/fileManagement/:directoryName",
        name: 'subDirectory',
        component: fileManagement, props: true
    },
    {
        path: "/fileManagement/:directoryName/:subDirectoryName",
        name: '2ndSubDirectory',
        component: fileManagement, props: true
    },
    {path: '/:notFound(.*)', redirect: '/'},
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router
