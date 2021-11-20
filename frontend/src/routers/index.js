import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import MainPage from "../views/MainPage";
import Test from "../views/Test";
import ProfilePage from "../views/ProfilePage";
import PostDetailPage from '../views/Post/Detail';
import CreateRateAndComment from "../views/CreateRateAndComment";
import SearchPage from "../views/SearchPage";
import Manage from "../views/Manage";
import ManageAccount from "../views/ManageAccounts";
import ManageAccountDetail from "../views/ManageAccounts/Detail";
import ManageReports from "../views/Reports";
import ManageProject from "../views/ManageProjects";
import ManageProjectDetail from "../views/ManageProjects/Detail";
import Projects from "../views/Projects";
import TaskDetailPage from "../views/TaskDetailPage";
import MyProjectsPage from "../views/MyProjectsPage";
import ProjectsDetail from "../views/Projects/Detail";
import RequestPage from "../views/RequestPage";
import CreateTaskPage from "../views/CreateTaskPage";
import ManageRequestPage from "../views/ManageRequestPage";
import CreateProjectPage from "../views/CreateProjectPage";
import EditProfilePage from "../views/EditProfile";
import React from "react";

export default function AppRouters() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                {/*add other routes below*/}
                <Route exact path="/post/:id" element={<PostDetailPage />} />
                <Route exact path="/manage" element={<Manage />} />
                <Route exact path="/account-manage" element={<ManageAccount />} />
                <Route exact path="/account-manage/:id" element={<ManageAccountDetail />} />
                <Route exact path="/myProjects/" element={< MyProjectsPage />} />
                <Route exact path="/project/:id" element={<ProjectsDetail />} />
                <Route exact path="/project" element={<Projects />} />
                <Route exact path="/project-manage" element={<ManageProject />} />
                <Route exact path="/project-manage/:id" element={<ManageProjectDetail />} />
                <Route exact path="/post/:id" element={<PostDetailPage />} />
                <Route exact path="/profile/:uuid" element={<ProfilePage />} />
                <Route exact path="/comment/:uuid" element={<CreateRateAndComment />} />
                <Route exact path="/search" element={<SearchPage />} />
                <Route exact path="/task/:uuid" element={<TaskDetailPage />} />
                <Route exact path="/request/:uuid" element={<RequestPage />} />
                <Route exact path="/createTask/:uuid" element={<CreateTaskPage />} />
                <Route exact path="/manageRequest/:projId" element={<ManageRequestPage />} />
                <Route exact path="/createProject" element={<CreateProjectPage />} />
                <Route exact path="/test" element={<Test />} />
                <Route exact path="/editprofile/:uuid" element={<EditProfilePage />} />
                <Route exact path="/report" element={<ManageReports />} />
                <Route exact path="/createProject" element={<CreateProjectPage />}/>
                <Route exact path="/test" element={<Test />}/>
            </Routes>
        </BrowserRouter>
    )
}
