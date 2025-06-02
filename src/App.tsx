import { useState, useEffect } from "react";
import {
    Container,
    Grid,
    TextField,
    Box,
    Typography,
    CircularProgress,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ClearIcon from "@mui/icons-material/Clear";
import { EpisodeCard } from "./components/EpisodeCard";
import { loadEpisodes } from "./utils/csvLoader";
import { Episode } from "./types/Episode";

function App() {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState<number>(4);

    useEffect(() => {
        loadEpisodes().then((data) => {
            setEpisodes(data);
            setLoading(false);
        });
    }, []);

    const handleColumnsChange = (event: React.MouseEvent<HTMLElement>, newColumns: number | null) => {
        if (newColumns !== null) {
            setColumns(newColumns);
        }
    };

    const handleClear = () => {
        setSearchTerm("");
    };

    const filteredEpisodes = episodes.filter((episode) =>
        episode.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getGridSize = (columns: number) => {
        switch (columns) {
            case 3:
                return {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 4,
                };
            case 5:
                return {
                    xs: 12,
                    sm: 6,
                    md: 3,
                    lg: 2.4,
                };
            case 7:
                return {
                    xs: 12,
                    sm: 4,
                    md: 3,
                    lg: 12 / 7,
                };
            default:
                return {
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 4,
                };
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#333",
                }}
            >
                ビッグコミックス ゴルゴ13 エピソードビューワー
            </Typography>

            <Box sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
                <TextField
                    fullWidth
                    label="エピソードを検索"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton aria-label="検索をクリア" onClick={handleClear} edge="end" size="small">
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                                borderColor: "#666",
                            },
                        },
                    }}
                />
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filteredEpisodes.map((episode, index) => (
                        <Grid item {...getGridSize(columns)} key={index}>
                            <EpisodeCard episode={episode} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default App;
