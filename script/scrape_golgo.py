import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from typing import List, Dict


def fetch_page(page_no: int) -> str:
    """指定されたページの内容を取得する"""
    url = f"https://bigcomics.jp/api/users/search_article?seriesId=130&contentId=10&pageNo={page_no}"
    response = requests.get(url)
    response.raise_for_status()
    return response.text


def parse_manga_items(html: str) -> List[Dict]:
    """HTMLから漫画アイテムの情報を抽出する"""
    soup = BeautifulSoup(html, "html.parser")
    items = soup.find_all("div", class_="series-ep-list-item")

    manga_items = []
    for item in items:
        # リンク要素を取得
        link_element = item.find("a", class_="article-ep-list-item-img-link")
        if not link_element:
            continue

        # タイトルを取得（img要素のalt属性から）
        img = item.find("img", class_="g-ogp-thumb-img")
        title = img["alt"] if img and "alt" in img.attrs else ""

        # サムネイル画像のURLを取得（PCサイズのWebP画像）
        thumbnail = ""
        pc_source = item.find("source", media="(min-width: 768px)")
        if pc_source:
            # srcsetかdata-srcsetから2x画像のURLを取得
            srcset = pc_source.get("srcset") or pc_source.get("data-srcset", "")
            if srcset:
                # 最初のURL（2x画像）を取得
                thumbnail_url = srcset.split(",")[0].strip().split(" ")[0]
                thumbnail = (
                    "https:" + thumbnail_url
                    if thumbnail_url.startswith("//")
                    else thumbnail_url
                )

        # リンクを取得
        link = link_element.get("href", "")
        if link and not link.startswith("http"):
            link = "https://bigcomics.jp" + link

        manga_items.append({"title": title, "thumbnail": thumbnail, "link": link})

    return manga_items


def main():
    all_items = []

    # 0から62ページまでスクレイピング
    for page in range(63):
        try:
            print(f"ページ {page} を処理中...")
            html = fetch_page(page)
            items = parse_manga_items(html)
            all_items.extend(items)

            # サーバーに負荷をかけないよう少し待機
            time.sleep(1)

        except Exception as e:
            print(f"ページ {page} の処理中にエラーが発生: {e}")
            continue

    # DataFrameを作成してCSVに保存
    df = pd.DataFrame(all_items)
    df.to_csv("golgo_manga_list.csv", index=False, encoding="utf-8")
    print(f"完了！ {len(all_items)} 件のデータを golgo_manga_list.csv に保存しました。")


if __name__ == "__main__":
    main()
