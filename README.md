# LinkUs
[Project Web Link](https://pacific-chamber-44657.herokuapp.com/)


## Express server route overview
Detailed expected request body, parameters, path and other information are documented in the codes in the backend. Below is an overview of the express server routes.
### Account APIs (`/api/account/`)
1. POST `/api/account/registration`

   Description: Sign up for an account.

   Expected request body:

    ```typescript
    interface ReqBody{
        username: string;
        password: string;
        email: string;
    }
    ```
2. POST `/api/account/registrationAdmin`

   Description: Sign up for an Admin account.

   Expected request body:

    ```typescript
    interface ReqBody{
        username: string;
        password: string;
        email: string;
    }
    ```
3. POST `/api/account/login`

   Description: Login.

   Expected request body:

    ```typescript
    interface ReqBody{
        password: string;
        email: string;
    }
    ```
4. GET `/api/account/logout`

   **Login required**

   Description: Sign out.

   No path parameters required since the server will use session to find the user.

5. GET `/api/account/user/:uuid`

   **Login required**

   Description: Get information of an user. `uuid` is the uuid of an user.

6. GET `/api/account/users`

   **Admin required**

   Description: Get information of all users in database.

7. PATCH `/api/account/profile`

   **Login required**

   Description: Modify profile of the current login user.

   Expected request body:

    ```typescript
    interface ReqBody{
        yearOfStudy?: number;
        program?: string;
        username?: string;
        exGPA?: number;
        bio?: string;
        courses?: string[];
    }
    ```

8. POST `/api/account/comment/:uuid`

   **Login required**

   Description: Add comment to an user.

   Expected request body:

    ```typescript
    interface ReqBody{
        comment: string;
    }
    ```

9. GET `/api/account/check-session`

   Description: Get user if the session is valid. Used for auto login.

### Project APIs (`/api/project`)

1. GET `/api/project/`

   **Admin required**

   Description: Get all projects stored in the database.

2. GET `/api/project/id/:uuid`

   **Login required**

   Description: Get information of a project. `uuid` is the uuid of that project.

3. POST `/api/project/`

   **Login required**

   Description: Create a new project.

   Expected request body:

    ```typescript
    interface ReqBody{
        title: string;
        description: string;
        courseCode: string;
        department: string;
        capacity: number;
        deadline: string; // a date string that can be parsed to Date object.(e.g. 2022-05-01)
    }
    ```

4. POST `/api/project/manageRequest/:uuid`

   **Login required**

   Description: Manage a request sent by other users. `uuid` is the uuid of a project. A request is used to join a project. Project owners can use this API to accept(`decision = 0`) or reject(`decision = 1`) a request.

   Expected request body:

    ```typescript
    interface ReqBody{
        requesterId: string; // uuid of the requester
        decision: number; // 0 for approve; 1 for decline
    }
    ```

5. POST `/api/project/moveTask/:uuid`

   **Login required**

   Description: Move a task in project with uuid `uuid` to different sections. There are three sections: planning, developing and finished.

    * 0 -- planning
    * 1 -- developing
    * 2 -- finished

   Expected request body:

    ```typescript
    interface ReqBody{
        taskId: string; // uuid of the task
        previous: number; // section that this task is in before change.
        target: number; // section that this task is moving to.
    }
    ```

6. POST `/api/project/addRequest/:uuid`

   **Login required**

   Description: Add a request to a project. A request is used to join a project.

   Expected request body:

    ```typescript
    interface ReqBody{
        info: string;
    }
    ```
7. PATCH `/api/project/:uuid`

   **Login required**

   Description: update information of a project.

   Expected request body:

    ```typescript
    interface ReqBody{
        title?: string;
        description?: string;
        capacity?: number;
        courseCode?: string;
        department?: string;
        deadline?: string; // a date string that can be parsed to Date object.(e.g. 2022-05-01)
    }
    ```

8. DELETE `/api/project/delete/:uuid`

   **Login required**

   Description: delete a project with uuid `uuid`.

9. DELETE `/api/project/deleteMember/:uuid`

   **Login required**

   Description: remove a member from a project with uuid `uuid`.

   Expected request body:

    ```typescript
    interface ReqBody{
        memberId: string; // uuid of that member
    }
    ```

10. POST `/api/project/search?content=`

    Description: search for projects with keyword provided in query parameter `content`. An **optional** request body can be provided for further filtering.

    Expected request body (**OPTIONAL**):

    ```typescript
    interface ReqBody{
        notFull?: boolean | null;
        department?: string | null;
        deadline?: string | null; // a date string that can be parsed to Date object.(e.g. 2022-05-01) 
        groupSize?: string | null;
    }
    ```

### Task APIs (`/api/task`)

1. GET `/api/task/`

   **Admin required**

   Description: Get all tasks stored in the database.

2. GET `/api/task/:uuid`

   **Login required**

   Description: Get information of a task with uuid `uuid`.

3.  POST `/api/task/`

    **Login required**

    Description: Create a new task.

    Expected request body:

    ```typescript
    interface ReqBody{
        projectId: string; // uuid of the project
        assigneeId: string; // uuid of the assignee
        title: string;
        description: string;
        dueDate: string; // a date string that can be parsed to Date object.(e.g. 2022-05-01)
    }
    ```

4.  POST `/api/task/comment/:uuid`

    **Login required**

    Description: Add new comment to a task with uuid `uuid`.

    Expected request body:

    ```typescript
    interface ReqBody{
        comment: string;
    }
    ```

5.  PATCH `/api/task/:uuid`

    **Login required**

    Description: Update information of a task with uuid `uuid`.

    Expected request body:

    ```typescript
    interface ReqBody{
        title?: string;
        description?: string;
        dueDate?: string;
    }
    ```

6. DELETE `/api/task/:uuid`

   **Login required**

   Description: Delete a task with uuid `uuid`.

### Report APIs (`/api/report`)

1.  POST `/api/report/`

    **Login required**

    Description: Report a comment.

    Expected request body:

    ```typescript
    interface ReqBody{
        comment: {
            targetId: string; // targetId in a comment object (a task uuid or an account uuid)
            userId: string; // userId in a comment object (commenter uuid)
            comment: string;
        }
    }
    ```
2. GET `/api/report/all`

   **Admin required**

   Description: Get all reports.

3.  DELETE `/api/report/delete/:uuid`

    **Admin required**

    Description: Delete the comment that is mentioned in a report with uuid `uuid`.

4.  DELETE `/api/report/ignore/:uuid`

    **Admin required**

    Description: Ignore a report with uuid `uuid`.

