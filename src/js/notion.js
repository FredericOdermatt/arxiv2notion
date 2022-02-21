export default class Notion {
  constructor() {
    this.token = null;
    this.apiBase = "https://api.notion.com/v1/";
  }

  torkenizedHeaders() {
    return {
      "Content-Type": "application/json",
      "Notion-Version": "2021-05-13",
      Authorization: `Bearer ${this.token}`,
    };
  }

  async requestToken(botId) {
    const url = "https://www.notion.so/api/v3/getBotToken";
    const body = { botId: botId };
    const headers = {
      Accept: "application/json, */*",
      "Content-type": "application/json",
    };
    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: headers,
      credentials: "include",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  }

  async retrievePage(pageId) {
    try {
      const url = this.apiBase + `pages/${pageId}`;
      const res = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: this.torkenizedHeaders(),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      throw err;
    }
  }

  async createPage(_data) {
    const data = await _data;
    const databaseId = document.getElementById("js-select-database").value;
    const title = data.title;
    const paperUrl = data.url;
    // const authorsFormatted = data.authors.join(",");
    const authorsFormatted = data.authors;
    var authors = [];
    for (var i = 0; i < authorsFormatted.length; ++i)
      authors[i] = { name: authorsFormatted[i]};
    try {
      const url = this.apiBase + "pages";
      const parent = {
        type: "database_id",
        database_id: databaseId,
      };
      const properties = {
        Title: {
          id: "title",
          type: "title",
          title: [{ text: { content: title } }],
        },
        URL: {
          id: "url",
          type: "url",
          url: paperUrl,
        },
        Authors: {
          id: "authors",
          type: "multi_select",
          multi_select: authors,
        },
      };

      const body = {
        parent: parent,
        properties: properties,
      };
      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: this.torkenizedHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      throw err;
    }
  }

  async retrieveDatabase() {
    try {
      const url = this.apiBase + "databases";
      const headers = this.torkenizedHeaders();
      console.log(headers);
      const res = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: headers,
      });
      const data = await res.json();

      data.results.forEach((result) => {
        const option = `<option value=${result.id}>${result.title[0].text.content}</option>`;
        document
          .getElementById("js-select-database")
          .insertAdjacentHTML("beforeend", option);
      });
      console.log(data);
    } catch (err) {
      console.log("[ERR] " + err);
      throw err;
    }
  }
}
