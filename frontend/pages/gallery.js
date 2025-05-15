import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { SectionNavigation } from "../components/SectionNavigation";

export default function Gallery() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:4000/api/gallery")
            .then(res => setPhotos(res.data));
    }, []);

    return (
        <Container sx={{ py: 5 }}>
            <Typography variant="h4" gutterBottom>Галерея</Typography>
            <Grid container spacing={3}>
                {photos.map(photo => (
                    <Grid item xs={12} sm={6} md={4} key={photo.id}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                            <CardMedia
                                component="img"
                                height="320"
                                image={photo.image_url}
                                alt={photo.description}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="body1" align="center">
                                    {photo.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <SectionNavigation
                prev={{ href: "/biography", label: "Биография" }}
                next={{ href: "/achievements", label: "Достижения" }}
            />
        </Container>
    );
}
