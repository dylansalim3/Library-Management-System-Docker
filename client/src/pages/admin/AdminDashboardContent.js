import React from 'react';
import { makeStyles } from "@material-ui/core";
import axios from "axios";
import studentIcon from "./../../images/student.svg";
import teacherIcon from "./../../images/teacher.svg";
import expiredBookIcon from "./../../images/expired-book.png";
import returnBookIcon from "./../../images/return-book.png";
import EnhancedTable from "../../components/EnhancedTable";
import Button from "@material-ui/core/Button";
import GetAppIcon from '@material-ui/icons/GetApp';
import DashboardCards from "../../components/DashboardCards";

const useStyle = makeStyles({
    card: {
        minWidth: 200,
    },
    cardContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    gridContainer: {
        flexGrow: 1,
    },
    typographyCardTitle: {
        fontSize: 14,
        color: '#D3D3D3',
    },
    floatRight: {
        float: 'right',
    },
    outerContainer: {
        paddingBottom: '60px',
    }
});


const AdminDashboardContent = () => {
    const classes = useStyle();
    const [studentCount, setStudentCount] = React.useState(0);
    const [teacherCount, setTeacherCount] = React.useState(0);
    const [overdueBookCount, setOverdueBookCount] = React.useState(0);
    const [booksBorrowed, setBooksBorrowed] = React.useState(0);
    const [notifications, setNotifications] = React.useState([]);
    const overviewItems = [
        { title: 'No. of students', detail: studentCount, icon: studentIcon },
        { title: 'No. of staff', detail: teacherCount, icon: teacherIcon },
        { title: 'No. of books overdue', detail: overdueBookCount, icon: expiredBookIcon },
        { title: 'No. of books borrowed this month', detail: booksBorrowed, icon: returnBookIcon }
    ];

    const headCells = [
        { id: 'title', numeric: false, disablePadding: false, label: 'Message' },
        { id: 'url', numeric: false, disablePadding: false, label: 'URL' },
        { id: 'user_id', numeric: false, disablePadding: false, label: 'Receiver' },
        { id: 'created', numeric: false, type: 'date', disablePadding: false, label: 'Date' },
        { id: 'unread', numeric: false, disablePadding: false, label: 'Read Status' },
    ];


    React.useEffect(() => {
        axios.post('/dashboard/admin-dashboard').then(result => {
            const apiResult = result.data;
            setStudentCount(apiResult.studentCount);
            setTeacherCount(apiResult.teacherCount);
            setOverdueBookCount(apiResult.overdueBookCount);
            setBooksBorrowed(apiResult.booksCurrentBorrowed);
        });
        axios.post('/notification/get-all-notifications').then(result => {
            console.log(result.data);
            result.data.forEach(r=>{
                if(r.unread===false){
                    r.unread="True";
                }else{
                    r.unread="False"
                }
            })
            setNotifications(result.data);
        });
    }, []);

    const generateReport = () => {
        axios({ url: 'report/get-monthly-report', method: 'POST' }).then(response => {
            if (response.data?.download !== undefined) {
                setTimeout(() => {
                    window.open(response.data?.download);
                }, 100
                )
            }
            // const url = window.URL.createObjectURL(new Blob([response.data]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', 'report.pdf');
            // document.body.appendChild(link);
            // link.click();
        }).catch(err => {
            // setOpenErrorSnackbar(true);
        });
    }

    return (
        <div className={classes.outerContainer}>
            <h1 style={{marginBottom:10}}>Overview</h1>
            <DashboardCards overviewItems={overviewItems} />
            <h1 style={{marginTop:25,marginBottom:10}}>Notification & Reminder</h1>
            <EnhancedTable headCells={headCells} rows={notifications}
                disableToolbar />

            <Button className={classes.floatRight} variant="contained" color="primary"
                startIcon={<GetAppIcon />} onClick={generateReport}> Generate PDF Report</Button>
        </div>
    );
};


export default AdminDashboardContent;
