import React, { ReactNode } from "react";

// language=CSS
const STYLE = `
  * {
    box-sizing: border-box;
  }

  :root {
    font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  nav > * {
    margin-left: 16px;
  }

  a {
    color: blue;
    text-decoration: none;
  }

  a:hover, a:focus {
    text-decoration: underline;
  }

  button {
    padding: 6px 12px;
  }

  input {
    padding: 8px;
  }

  label {
    display: block;
  }

  label > * {
    display: block;
    resize: none;
    width: 100%;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
  }

  th {
    text-align: left;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const Page = ({
  content,
  title,
}: {
  content: ReactNode;
  title: string;
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1"
      />
      <title>{title} - MyDNS</title>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
    </head>
    <body>
      <header>
        <h1>
          <a href="/">MyDNS</a>
        </h1>
        <nav>
          <a href="/AddOrUpdateBlocklist">Add blocklist</a>
          <a href="/CreateNewCustomList">Create new custom list</a>
        </nav>
      </header>
      <main>{content}</main>
    </body>
  </html>
);
