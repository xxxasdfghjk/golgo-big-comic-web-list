import { Card, CardContent, CardMedia, Typography, CardActionArea } from "@mui/material";
import { Episode } from "../types/Episode";

interface EpisodeCardProps {
    episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
    return (
        <Card sx={{ maxWidth: 345, height: "100%" }}>
            <CardActionArea href={episode.link} target="_blank" rel="noopener noreferrer" sx={{ height: "100%" }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={episode.thumbnail}
                    alt={episode.title}
                    sx={{
                        objectFit: "cover",
                        backgroundColor: "#f5f5f5",
                    }}
                />
                <CardContent>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontSize: "1rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                        }}
                    >
                        {episode.title}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
