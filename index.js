import { omit, sortBy } from "lodash-es";
import { writeFileSync } from "fs";

const pages = Array.from(Array(40).keys());
const perPage = 50;
const games = [];

await Promise.all(
  pages.map(async (page) => {
    const {
      data: { items },
    } = await fetch(
      `https://internal-prod.apigee.fandom.net/v1/xapi/finder/metacritic/web?sortBy=-metaScore&productType=games&page=${
        page + 1
      }&releaseYearMin=1958&releaseYearMax=2024&offset=${
        page * perPage
      }&limit=${perPage}&apiKey=1MOZgmNFxvmljaQR1X9KAij9Mo4xAY3u`
    ).then((rsp) => rsp.json());
    const cleaned = items.map((item) => ({
      ...omit(item, [
        "streamingDates",
        "network",
        "duration",
        "seoUrl",
        "criticScoreSummary",
        "numberOfSeasons",
        "premiereYear",
        "type",
        "typeId",
        "slug",
      ]),
      url: `https://www.metacritic.com/game/${item.slug}/`,
      rating: item.criticScoreSummary.score,
      releaseDate: new Date(item.releaseDate),
      genres: item.genres.map((genre) => genre.name),
      ...(item.image
        ? {
            image: `https://www.metacritic.com/a/img/catalog${item.image.bucketPath}`,
          }
        : {}),
    }));

    games.push(...cleaned);
  })
);

writeFileSync(
  "out.json",
  JSON.stringify(sortBy(games, "rating").reverse(), null, 2)
);
