import styles from "./style.module.css";
import Header from "../../components/Header";
import Button from "../../components/Button";
import React from "react";
import { getUserById as apiGetUserById, updateUser as apiUpdateUser } from "../../api/requets/account";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/accountSlice";
import { checkSession } from "../../api/requets/account";

export default function ProjectPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initialValues = {
        username: "",
        yearOfStudy: "",
        program: "",
        exGPA: "",
        courses: [],
        bio: "",
    }

    const [values, setValues] = React.useState(initialValues);

    const [courses, setcourses] = React.useState("");

    const { uuid } = useParams();

    const getProfileDetail = () => {
        apiGetUserById(uuid).then((res) => {
            setValues({
                username: res.profile.username,
                yearOfStudy: res.profile.yearOfStudy,
                program: res.profile.program,
                exGPA: res.profile.exGPA,
                courses: res.profile.courses,
                bio: res.profile.bio,
            })
        })
    }

    React.useEffect(() => {
        getProfileDetail()
    }, [uuid])

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const toHome = () => {
        console.log(values);
        apiUpdateUser({
            ...values
        }).then((res) => {
            if (!res._id) {
                alert("updata error")
            } else {
                alert("updata success");
                checkSession()
                    .then(user => dispatch(setUser(user)))
                    .catch(e => { });
            }

        }).finally(() => navigate(-1));
    };
    function del(e) {
    }
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.wrapper}>
                <div className={styles.titleContainer}>
                    <p className={styles.title}>
                        Edit My Profile
                    </p>
                </div>
                <hr className={styles.titleLine} />
                <div className={styles.card}>
                    Name *
                    <input
                        placeholder={'Username'}
                        className={styles.input}
                        name={"username"}
                        value={values.username}
                        onChange={handleInputChange}
                    />
                    Year Of Stydy *
                    <input
                        placeholder={"ex. 1"}
                        className={styles.input}
                        name={"yearOfStudy"}
                        type="number"
                        value={values.yearOfStudy}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.card}>
                    Program of study
                    <input
                        placeholder={"ex. Mathematics"}
                        className={styles.longInput}
                        name={"program"}
                        value={values.program}
                        onChange={e => setValues(v => ({...v, program: e.target.value}))}
                    />
                    Expected CGPA
                    <input
                        placeholder={"ex. 4"}
                        className={styles.longInput}
                        name={"exGPA"}
                        value={values.exGPA}
                        onChange={handleInputChange}
                        type="number"
                    />
                </div>
                <div className={styles.card}>
                    Courses
                    <input
                        placeholder={"ex. CSC369"}
                        className={styles.input}
                        name={"courses"}
                        value={courses}
                        onChange={(e) => { setcourses(e.target.value) }}
                    />
                    <div className={styles.add} onClick={(e) => {
                        if (courses) {
                            setValues({
                                ...values,
                                courses: [...values.courses, courses],
                            })
                            setcourses("")
                        }
                    }}>Add</div>
                    <div style={{ width: "100%" }} onClick={del}>
                        {
                            values.courses.map((item, index) => {
                                return <li key={index} style={{ color: 'green' }}> {item
                                }</li>
                            })
                        }
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.descriptionBody}>
                        Bio
                        <textarea
                            name={"bio"}
                            value={values.bio}
                            onChange={handleInputChange}
                            placeholder={"Please Enter Request Information"}
                            className={styles.description}
                        />
                    </div>
                </div>
                <div className={styles.buttonWrapper}>
                    <Button className={styles.sendButton}
                        onClick={toHome}>
                        <p>Post</p>
                    </Button>
                </div>
            </div>
        </div>
    )


}
