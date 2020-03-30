const path = require("path");
const crawl = require("..").default;

const FOLDER = path.join(__dirname, "..", "test", "data");

suite("Crawl benchmark", () => {
	test("crawl", done => crawl(FOLDER, x => x).then(() => done()).catch(done));
});
