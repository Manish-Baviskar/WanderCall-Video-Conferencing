import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

export default function History() {

    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyData = await getHistoryOfUser();

                // Robust data checking (Handles different backend response structures)
                if (historyData.activity) {
                    setMeetings(historyData.activity);
                } else if (Array.isArray(historyData)) {
                    setMeetings(historyData);
                } else {
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
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        const time = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });

        return `${day}/${month}/${year} at ${time}`;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0a23' }}> {/* Dark Background */}
            
            {/* Header */}
            <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                p: 3, 
                borderBottom: '1px solid #333' 
            }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                    Meeting History
                </Typography>
                <IconButton onClick={() => routeTo("/home")}>
                     <HomeIcon sx={{ color: 'white', fontSize: 40 }} />
                </IconButton>
            </Box>

            {/* List Container */}
            <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {meetings.length === 0 ? (
                    <Typography style={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>
                        No meeting history found.
                    </Typography>
                ) : (
                    meetings.map((e, i) => {
                        return (
                            <Paper key={i} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#1a1a2e' }}>
                                <Accordion sx={{ bgcolor: 'transparent', color: 'white', boxShadow: 'none' }}>
                                    
                                    {/* Visible Summary (Code + Date) */}
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                                        aria-controls={`panel${i}-content`}
                                        id={`panel${i}-header`}
                                    >
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4dabf5' }}>
                                                    Code: {e.meetingCode}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
                                                    Joined on: {e.date ? formatDate(e.date) : "Unknown Date"}
                                                </Typography>
                                            </Box>
                                            
                                            {/* Badge showing number of attendees */}
                                            {e.attendees && (
                                                <Box sx={{ mr: 2, px: 2, py: 0.5, bgcolor: '#4dabf5', color: 'black', borderRadius: 4, fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                    {e.attendees.length} Participants
                                                </Box>
                                            )}
                                        </Box>
                                    </AccordionSummary>

                                    {/* Hidden Details (Attendees List) */}
                                    <AccordionDetails sx={{ bgcolor: '#16213e', borderTop: '1px solid #333', p: 3 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, color: '#aaa', letterSpacing: '1px' }}>
                                            PARTICIPANTS LIST
                                        </Typography>
                                        
                                        <Grid container spacing={2}>
                                            {e.attendees && e.attendees.length > 0 ? (
                                                e.attendees.map((attendee, idx) => (
                                                    <Grid item xs={12} sm={4} md={3} key={idx}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                                                            <Avatar sx={{ bgcolor: '#ff9800' }}>
                                                                {attendee.name ? attendee.name.charAt(0).toUpperCase() : "?"}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                    {attendee.name}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#aaa' }}>
                                                                    @{attendee.username}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                ))
                                            ) : (
                                                <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>
                                                    No attendee details available.
                                                </Typography>
                                            )}
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Paper>
                        )
                    })
                )}
            </Box>
        </div>
    )
}