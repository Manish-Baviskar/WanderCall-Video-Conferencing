import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import styles from '../styles/history.module.css';

export default function History() {

    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyData = await getHistoryOfUser();
                
                
                console.log("RAW HISTORY DATA:", historyData);

                
                if (historyData.activity) {
                    setMeetings(historyData.activity);
                } else if (Array.isArray(historyData)) {
                    setMeetings(historyData);
                } else {
                    
                    console.log("Data structure is unsure, setting as empty array");
                    setMeetings([]);
                }

            } catch (e) {
                console.log("Error fetching history:", e);
            }
        }

        fetchHistory();
    }, [])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();
        return `${day}/${month}/${year}`
    }

    return (
        <div className={styles.historyContainer}>
            
            <div className={styles.header}>
                <h1 className={styles.title}>Meeting History</h1>
                
                <IconButton 
                    className={styles.backBtn} 
                    onClick={() => { routeTo("/home") }}
                >
                    <HomeIcon />
                </IconButton >
            </div>

            {meetings.length !== 0 ? (
                <div className={styles.cardGrid}>
                    {meetings.map((e, i) => {
                        return (
                            <Card key={i} variant="outlined" className={styles.historyCard}>
                                <CardContent>
                                    <Typography 
                                        sx={{ fontSize: 14 }} 
                                        className={styles.cardCode} 
                                        gutterBottom
                                    >
                                        
                                        Meeting Code: {e.meetingCode || e.meeting_code}
                                    </Typography>

                                    <Typography 
                                        sx={{ mb: 1.5 }} 
                                        className={styles.cardDate}
                                    >
                                        
                                        Joined on: {e.date ? formatDate(e.date) : "Unknown Date"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <p>No meeting history found.</p>
                </div>
            )}
        </div>
    )
}