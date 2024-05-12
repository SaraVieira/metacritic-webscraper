import axios from "axios";
import fs, { existsSync, readFileSync } from "fs";

const download_image = async (url) => {
  const imagesPaths = url.split("/");
  const imageName = imagesPaths[imagesPaths.length - 1];
  if (existsSync(`./images/${imageName}`)) return;
  const response = await axios({
    url,
    responseType: "stream",
  });

  new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(`./images/${imageName}`))
      .on("finish", () => resolve())
      .on("error", (e) => reject(e));
  });
};

const json = JSON.parse(readFileSync("./out.json"));

await Promise.all(json.map((d) => download_image(d.image)));
