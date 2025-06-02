import { Episode } from "../types/Episode";

const BASE_PATH = import.meta.env.DEV ? "" : "/golgo-big-comic-web-list";

export async function loadEpisodes(): Promise<Episode[]> {
    try {
        const response = await fetch(`${BASE_PATH}/manga_list.csv`);
        const text = await response.text();

        // CSVをパース
        const lines = text.split("\n");
        const episodes: Episode[] = [];

        // ヘッダー行をスキップ
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const [title, thumbnail, link] = line.split(",");
                episodes.push({ title, thumbnail, link });
            }
        }

        return episodes;
    } catch (error) {
        console.error("Error loading episodes:", error);
        return [];
    }
}
