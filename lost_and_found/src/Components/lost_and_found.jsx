import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import ListInventory from './ListInventory';
import { getAll } from '../service'; // Assuming you have this service

const LostAndFoundPage = () => {
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAll();
                console.log('response:', response);

                if (response.error) {
                    console.error('Failed to fetch lost and found items:', response.error);
                    return;
                }

                const lostitems = response.filter(item => item.lost);
                const founditems = response.filter(item => item.found);

                console.log('lostitems:', lostitems);
                console.log('founditems:', founditems);

                setLostItems(lostitems);
                setFoundItems(founditems);
            } catch (error) {
                console.error('Failed to fetch lost and found items:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log('Updated lostItems:', lostItems);
        console.log('Updated foundItems:', foundItems);
    }, [lostItems, foundItems]);

    return (
        <Container className="mx-auto mt-8">
            <Typography variant="h3" gutterBottom>
                Lost and Found
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <Typography variant="h5">Lost Items</Typography>
                    <ListInventory supplies={lostItems} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5">Found Items</Typography>
                    <ListInventory supplies={foundItems} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default LostAndFoundPage;
